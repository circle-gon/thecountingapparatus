import { ce, TextChannel } from "../utils/text.js";
import { escapeHtml } from "../utils/utils.js";

const factions = {};
export { factions };
export class FactionBase {
  constructor(name, msReq) {
    this.name = name;
    this.msReq = msReq;
    this.milestones = 0;
    this.count = 0;
    this.goals = [];
    this.goalsCompleted = [];
    console.log("init");
    this.textBox = new TextChannel(
      name,
      name,
      100,
      1,
      (msg) => {
        return {
          isCorrect: this.isCorrectCount(msg)
        };
      },
      (i) => {
        const ele = ce("div");
        const txt = ce("span");
        txt.innerHTML = escapeHtml(i.msg).replaceAll(
          /gwa|:gwa:/g,
          `<img src="https://cdn.glitch.global/c4b4c3c5-22da-4237-8d6f-f6335452d8b5/gwa.png?v=1665428837632" />`
        );

        ele.append(txt);
        ele.style.color = i.isCorrect ? "green" : "red";
        return ele;
      }
    );
    this.textBox.on((i) => this.doCount(i), "message");
    factions[name] = this;
  }
  // abstracts
  isValidCount(count) {} //XX, Ones, Factorial

  parseCount(count) {} //XX, Ones, Factorial

  get nextCount() {} //???

  spireBoost() {} //All Factions

  onMilestone() {}

  //defined
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

  updateGoals() {
    for (const [key, goal] of this.goals.entries()) {
      if (goal() && !this.goalsCompleted.includes(key))
        this.goalsCompleted.push(key);
    }
  }

  doCount(count) {
    if (this.isCorrectCount(count)) {
      this.count = this.nextCount;
      this.updateMilestones();
      this.updateGoals();
    }
  }

  get milestoneNextAt() {
    return this.msReq(this.milestones);
  }

  get milestoneRewards() {
    return {};
  }

  get isSpire() {
    return this.goalsCompleted.length === this.goals.length;
  }
}

class FactionDisplay extends HTMLElement {
  updateHTML(count) {
    this.info.innerHTML = `Count: ${this.faction.count}<br>
    Next count: ${this.faction.nextCount}<br>
    Next milestone: ${this.faction.milestoneNextAt}<br>
    Current amount of milestones: ${this.faction.milestones}`;
    if(this.getAttribute("name") === "Tree") {
    this.c.style.border = "solid"
    this.c.width = factions.Tree.grid*10
    this.c.height = factions.Tree.grid*10
    const ctx = this.c.getContext("2d")
    ctx.clearRect(0,0,this.c.width,this.c.height)
    ctx.fillStyle = "gray"
    ctx.fillRect(0,0,this.c.width,this.c.height)
    ctx.fillStyle = "white"
    ctx.fillRect(0,0,this.c.width,Math.floor(factions.Tree.count/factions.Tree.grid)*10)
    ctx.fillRect(0,Math.floor(factions.Tree.count/factions.Tree.grid)*10,(factions.Tree.count%factions.Tree.grid)*10,10)
    //ctx.fillRect(0,20,30,20)
    }
  }
  connectedCallback() {
    if (!this.isConnected) return;

    this.attachShadow({ mode: "open" });
    const name = this.getAttribute("name");

    this.info = ce("div");
    this.faction = factions[name];

    const root = ce("div");
    const chatInstance = ce("text-box");

    // RE: why do we need setAttribute?
    chatInstance.setAttribute("name", name);
    console.log("faction go boom");
    root.append(chatInstance, this.info);
    this.shadowRoot.append(root);
    if(name === "Tree") {
      this.c = ce("canvas")
      const c = this.c
      c.style.border = "solid"
      c.width = factions.Tree.grid*10
      c.height = factions.Tree.grid*10
      const ctx = c.getContext("2d")
      ctx.fillStyle = "gray"
      ctx.fillRect(0,0,c.width,c.height)
      ctx.fillStyle = "white"
      ctx.fillRect(0,0,c.width,Math.floor(factions.Tree.count/factions.Tree.grid)*10)
      ctx.fillRect(0,Math.floor(factions.Tree.count/factions.Tree.grid)*10,(factions.Tree.count%factions.Tree.grid)*10,Math.floor(factions.Tree.count/factions.Tree.grid)*10+10)
      root.append(c)
    }
    this.faction.textBox.on((i) => this.updateHTML(i), "message");
    this.updateHTML("");
  }
}

customElements.define("faction-disp", FactionDisplay);
