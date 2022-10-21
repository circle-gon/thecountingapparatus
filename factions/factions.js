//Imports
import { ce, TextChannel, addEmoji } from "../text/channel.js";
import { escapeHtml, randomColor } from "../utils/utils.js";
import { FUNCTIONS } from "../functions/functionList.js";
import { parse2 } from "./risingstarparser.js";
import { showModal } from "../ui/modals.js";

//Factions Objects
export const factions = (window.factions = {});

// base class to differernate standard js errors vs compilation errors
class ParserError extends Error {}

//Faction superclass
export class FactionBase {
  constructor(name, msReq, challenges = []) {
    //Constant data
    this.name = name;
    this.msReq = msReq;
    this.milestones = 0;
    this.count = 0;
    this.goals = [];
    this.goalsCompleted = [];
    this.challengeDetails = challenges;
    this.inChallenge = null;
    this.challenges = Array(challenges.length).fill(0);

    //Text box logic
    this.textBox = new TextChannel(
      name,
      name,
      100,
      1000,
      (msg) => {
        return {
          isCorrect: this.isCorrectCount(msg),
        };
      },
      (i) => {
        const ele = ce("div");
        const txt = ce("span");
        txt.innerHTML = addEmoji(escapeHtml(i.msg));

        ele.append(txt);
        ele.style.color = i.isCorrect ? "green" : "red";
        return ele;
      }
    );
    this.textBox.on((i, type) => {
      if (type) return;
      this.doCount(i);
    }, "message");
    factions[name] = this;
  }

  // abstracts

  parseCount(count) {} //XX, Ones, Factorial

  spireBoost() {} //All Factions

  onMilestone() {}

  isValidCount() {
    return true;
  }

  get milestoneRewards() {
    return {};
  }

  countToDisplay(c) {
    return c;
  }

  get realCount() {
    return this.challenges[this.inChallenge] ?? this.count;
  }

  isInChallenge(n) {
    return this.inChallenge === n;
  }

  challengeUnlocked(i) {
    return !(this.challengeDetails[i].unlocked?.() ?? true);
  }

  enterChallenge(i) {
    if (![...this.challengeDetails.keys()].includes(i))
      throw new TypeError("Attempted to enter challenge that does not exist");
    if (this.challengeUnlocked(i))
      throw new TypeError("Attempted to enter challenge that is not unlocked.");
    this.inChallenge = i;
    this.textBox.switchToChat(this.challengeDetails[i].title);
    this.challengeDetails[i].onStart?.();
    this.textBox.eventListener.emit("challChange", i);
  }

  exitChallenge() {
    this.textBox.switchToChat("default");
    this.challengeDetails[this.inChallenge].onExit?.();
    this.inChallenge = null;
    this.textBox.eventListener.emit("challChange", null);
  }

  //Count & Milestones

  get nextCount() {
    return this.realCount + 1;
  }

  doCount(count) {
    if (this.isCorrectCount(count)) {
      if (this.inChallenge !== null) {
        this.challenges[this.inChallenge] = this.nextCount;
      } else {
        this.count = this.nextCount;
        this.updateMilestones();
      }
      this.updateGoals();
    }
  }

  updateMilestones() {
    const oldMilestone = this.milestones;
    while (this.count >= this.milestoneNextAt) {
      this.milestones++;
    }
    if (this.milestones > oldMilestone) {
      this.onMilestone();
    }
  }

  isCorrectCount(count) {
    return (
      this.isValidCount(count) && this.nextCount === this.parseCount(count)
    );
  }

  get milestoneNextAt() {
    return this.msReq(this.milestones);
  }

  //Goals & Spires
  updateGoals() {
    for (const [key, goal] of this.goals.entries()) {
      if (goal() && !this.goalsCompleted.includes(key))
        this.goalsCompleted.push(key);
    }
  }

  get isSpire() {
    return this.goalsCompleted.length === this.goals.length;
  }

  //Global Data
  static get effectiveMilestones() {
    let stoneCount = 0;
    for (const value of Object.values(factions)) {
      if (value.name === "Letter" || value.name === "Factorial") {
        stoneCount -= value.milestones;
      } else {
        stoneCount += value.milestones;
      }
    }
    return stoneCount;
  }

  static get totalMilestones() {
    let stoneCount = 0;
    for (const value of Object.values(factions)) {
      stoneCount += value.milestones;
    }
    return stoneCount;
  }

  static get average() {
    let average = 0;
    let counter = 0;
    for (const value of Object.values(factions)) {
      average += value.count;
      counter++;
      if (value.hasChal) {
        for (let chal of value.challenges) {
          average += chal;
          counter++;
        }
      }
    }
    return average / counter;
  }

  static parseFunction(str) {
    return parse2(str);
  }
}
//Equation Parsing / Scanning

class FactionDisplay extends HTMLElement {
  updateHTML() {
    const c = (co) => this.faction.countToDisplay(co);
    this.info.innerHTML = `Count: ${c(this.faction.realCount)}<br>
    Next milestone: ${c(this.faction.milestoneNextAt)}<br>
    Current amount of milestones: ${this.faction.milestones}
    ${
      this.faction.inChallenge === null
        ? ""
        : `<br>You are in challenge ${this.faction.challengeDetails[this.faction.inChallenge]}`
    }`;
    if (this.getAttribute("name") === "Tree") {
      const treeGridSize = factions.Tree.grid;
      this.c.style.display = this.faction.realCount === 0 ? "none" : "block";
      this.c.width = factions.Tree.grid * 10;
      this.c.height = factions.Tree.grid * 10;
      const ctx = this.c.getContext("2d");
      ctx.clearRect(0, 0, this.c.width, this.c.height);
      ctx.fillStyle = "gray";
      ctx.fillRect(0, 0, this.c.width, this.c.height);
      // ctx.fillStyle = randomColor(); //create randomColor function
      for (let x = 0; x < factions.Tree.realCount; x++) {
        // random colour per cell
        ctx.fillStyle = randomColor();
        ctx.fillRect(
          (x % treeGridSize) * 10,
          Math.floor(x / treeGridSize) * 10,
          10,
          10
        );
      }
      // ctx.fillRect(
      //   0,
      //   0,
      //   this.c.width,
      //   Math.floor(factions.Tree.count / factions.Tree.grid) * 10
      // );
      // ctx.fillRect(
      //   0,
      //   Math.floor(factions.Tree.count / factions.Tree.grid) * 10,
      //   (factions.Tree.count % factions.Tree.grid) * 10,
      //   10
      // );
      //ctx.fillRect(0,20,30,20)
    }
  }
  disconnectedCallback() {
    this.stop.forEach((i) => i());
  }
  connectedCallback() {
    if (!this.isConnected) return;

    this.attachShadow({ mode: "open" });
    const name = this.getAttribute("name");
    this.faction = factions[this.getAttribute("name")];

    const topRightData = ce("div");

    topRightData.style.position = "absolute";
    topRightData.style.top = "0";
    topRightData.style.right = "0";
    topRightData.style.margin = "5px";
    topRightData.style.textAlign = "center";

    this.info = ce("div");

    const root = ce("div");
    const chatInstance = ce("text-box");
    chatInstance.setAttribute("name", this.getAttribute("name"));

    // RE: why do we need setAttribute?
    this.stop = [
      this.faction.textBox.on(() => this.updateHTML(), "message"),
      this.faction.textBox.on(() => this.updateHTML(), "challChange"),
    ];

    topRightData.append(this.info);
    if (this.faction.challengeDetails.length > 0) {
      const chalSelect = ce("button");
      chalSelect.innerHTML = "Challenge selector";
      chalSelect.onclick = () => {
        showModal("challengeSelector", this.faction);
      };
      topRightData.append(chalSelect);
    }
    root.append(chatInstance, topRightData);
    //root.style.position = "relative"
    if (name === "Tree") {
      this.c = ce("canvas");
      this.c.style.border = "solid";
      root.append(this.c);
    }
    this.shadowRoot.append(root);
    this.updateHTML();
  }
}

customElements.define("faction-disp", FactionDisplay);
