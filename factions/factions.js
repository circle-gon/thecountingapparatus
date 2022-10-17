//Imports
import { ce, TextChannel } from "../text/channel.js";
import { escapeHtml, randomColor } from "../utils/utils.js";
import { FUNCTIONS } from "../functions/functionList.js";

//Factions Objects
export const factions = {};

// base class to differernate standard js errors vs compilation errors
class ParserError extends Error {}

//Faction superclass
export class FactionBase {
  constructor(name, msReq) {
    //Constant data
    this.name = name;
    this.msReq = msReq;
    this.milestones = 0;
    this.count = 0;
    this.goals = [];
    this.goalsCompleted = [];

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

  doCount(count) {}

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

  //Count & Milestones

  get nextCount() {
    return this.count + 1;
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

  parseFunction(str) {
    // ASSUMES FULL BRACKETING
    // ALSO ASSUMES EVERYTHING IS A FUNCTION (very easy if things are suggested/selected from a list client side)
    // ALSO ASSUMES MORE STUFF AND ISN'T FINISHED
    // CURRENTLY RUNS ON NAMES OF FUNCTIONS
    // ALSO GWA

    // split into a full arrawy of just functions and their arguments
    const splitStr = str.split(/([,])|[()]/).filter((x) => x !== "" && x !== undefined);
    // console.log(splitStr);
    // let splitStr = [];
    // for (const s of splitStrt) {
    //   let split = s.split(/[(,)]/).filter((x) => x !== "");
    //   for (const sp of split) {
    //     splitStr.push(sp);
    //   }
    // }
    // look for literals (the base case)
    let literals = [];
    let literalsIndexes = [];
    for (let i = 0; i < splitStr.length; i++) {
      // check if literal and add to list - maybe have it add index as well?
      if (/\d/.test(splitStr[i])) {
        literals.push(Number(splitStr[i]));
        literalsIndexes.push(i);
      }
    }
    while (splitStr.length > 1) {
      // console.log(splitStr);
      // console.log(literals);
      // console.log(literalsIndexes);
      for (let i = 0; i < literals.length; i++) {
        const value = literals[i];
        const index = literalsIndexes[i];
        const leftFunc = splitStr[index - 1];
        // rightFunc should be either nonexistant or a comma
        //let rightFunc = splitStr[index + 1]; // stop this checking oob
        if (leftFunc === ",") {
          // ignore it
          continue;
        }
        // this _returns_ a new string
        // so you're doing Functions[undefined]
        //const FUNCTIONS = import("../functions/functionList.js"); // maybe temp
        const actualFunc = Object.values(FUNCTIONS).find(
          (i) => i.syntax.substring(0,i.syntax.indexOf("("))[0] === leftFunc
        );
        //console.log(actualFunc);
        // find number of arguments (work out arbitrary args later, may need to ke(6)ep brackets in split)
        if (actualFunc === undefined || !actualFunc.isUnlocked) {
          throw new ParserError(
            actualFunc === "undefined"
              ? `Function ${leftFunc} does not exist.`
              : `Function ${actualFunc} is not unlocked.`
          );
        }
        if (actualFunc.isBanned || actualFunc.isStunned) {
          // special stuff
        }
        const expectedArgs = actualFunc.syntax.split(',');//actualFunc.expectedArgs; // expected args will cover if they're matrices, real, etc
        const args = [];
        const argsIndexes = [];
        args.push(literals[literalsIndexes.indexOf(index)]);
        argsIndexes.push(index);
        // console.log(literals);
        // console.log(literalsIndexes);
        for (let j = 0; j < expectedArgs.length-1; j++) {
          // has arg been calculated to literal already
          if (
            splitStr[index + 1 + 2*j] === "," &&
            literalsIndexes.includes(index + 2 + 2*j)
          ) {
            args.push(literals[literalsIndexes.indexOf(index + 2 + 2*j)]);
            argsIndexes.push(index + 2 + 2*j);
          }
        }
        if (args.length == expectedArgs.length) {
          // console.log(args);
          // console.log(argsIndexes);
          let result = actualFunc.evaluate(args);
          // update literals lists
          for (let k = 0; k < expectedArgs.length; k++) {
            literals[literalsIndexes.indexOf(argsIndexes[k])] = "test"; // to avoid resizing while deleting
            literalsIndexes[literalsIndexes.indexOf(argsIndexes[k])] = "test";
          }
          literals = literals.filter(x => x != "test");
          literalsIndexes = literalsIndexes.filter(x => x != "test");
          for (let q = 0; q < literalsIndexes.length; q++) {
            if (literalsIndexes[q] > index - 1) {
              literalsIndexes[q] -= expectedArgs.length * 2 - 1;
            }
          }
          literals.push(result);
          literalsIndexes.push(index - 1);
          
          // update splitStr
          splitStr[index - 1] = result;
          // remove calculated stuff
          for (let j = 0; j < expectedArgs.length * 2 - 1; j++) {
            splitStr.splice(index, 1);
          }
          
          // reset the literals search
          break;
        }
        else {
          console.log("bad argument count for " + actualFunc.name + "?");
          //throw new ParserError("Invalid number of arguments for " + actualFunc.name);
        }
      }
    }
    return splitStr[0]; // gwa
  }
}
//Equation Parsing / Scanning

class FactionDisplay extends HTMLElement {
  updateHTML() {
    const c = (co) => this.faction.countToDisplay(co);
    this.info.innerHTML = `Count: ${c(this.faction.count)}<br>
    Next count: ${c(this.faction.nextCount)}<br>
    Next milestone: ${c(this.faction.milestoneNextAt)}<br>
    Current amount of milestones: ${this.faction.milestones}`;
    if (this.getAttribute("name") === "Tree") {
      const treeGridSize = factions.Tree.grid;
      this.c.style.display = this.faction.count === 0 ? "none" : "block";
      this.c.width = factions.Tree.grid * 10;
      this.c.height = factions.Tree.grid * 10;
      const ctx = this.c.getContext("2d");
      ctx.clearRect(0, 0, this.c.width, this.c.height);
      ctx.fillStyle = "gray";
      ctx.fillRect(0, 0, this.c.width, this.c.height);
      // ctx.fillStyle = randomColor(); //create randomColor function
      for (let x = 0; x < factions.Tree.count; x++) {
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

    this.info = ce("div");
    this.info.style.position = "absolute";
    this.info.style.top = "0";
    this.info.style.right = "0";
    this.info.style.margin = "5px"

    const root = ce("div");
    const chatInstance = ce("text-box");
    chatInstance.setAttribute("name", this.getAttribute("name"));

    // RE: why do we need setAttribute?
    this.stop = [this.faction.textBox.on(() => this.updateHTML(), "message")];
    root.append(chatInstance, this.info);
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
