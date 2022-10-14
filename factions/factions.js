//Imports
import { ce, TextChannel } from "../utils/text.js";
import { escapeHtml, randomColor } from "../utils/utils.js";
import { Functions, Operators } from "../functions/functionClass.js";


//Factions Objects
export const factions = {};

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
      1,
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
  
  //Equation Parsing / Scanning
  static parseOperator(msg, faction) {
    for (const opCheck of Object.values((Operators))){ // 3+3+3 
      let op = msg.indexOf(opCheck.syntax)
      
    } 
  } //[["literal",3],["operator","+"],["literal",3],["operator","+"],["literal",3]]
  static testParseFunction(msg) {
    const parens = []
    for (let loc=0;loc<msg.length;loc++) {
      const char = msg[loc]
      if (char === "(") parens.push(loc)
    }
  }
  static parseFunction(msg, faction) {
    msg = msg.replaceAll(" ", "");
    for (const functionCheck of Object.values(Functions).filter(i=>!(Operators))) {
      
      //synCheck
      const name = functionCheck.syntax.substring(
        0,
        functionCheck.syntax.indexOf("(")
      );
      while (!msg.includes(name)){
        if (functionCheck.isUnlocked) {
          const start = msg.indexOf(functionCheck.syntax[0]);
          const parenCheck = msg.substring(start);
          let indexOfEnd = start+parenCheck.indexOf("(");
          let parenDepth = 0;
          let args = [];
          let i = 0;
          do{
            if(indexOfEnd == "(") parenDepth++;
            if(indexOfEnd == ")") parenDepth--;
            if(indexOfEnd == "," && parenDepth == 1) i++;
            args[i] = args[i].concat(msg[indexOfEnd++]);
          }while(parenDepth !== 0);
          const end = --indexOfEnd;
          const correctArgs = functionCheck.syntax
            .substring(name + 1, indexOfEnd)
            .split(",");
          if (args.length !== correctArgs.length)
            throw new TypeError(
              `Invalid number of arguments passed to ${name}: ${args.length}` +
                `arguments passed, but ${correctArgs.length} arguments required.` +
                "Please check your syntax!"
            );
          for (const [i, arg] of args.entries()) {
            if (isNaN(Number(arg))) {
              arg = this.parseFunction(arg, faction);
              arg = this.parseOperator(arg, faction);
            }
            msg = msg.replace(
              msg.substring(
                start,
                msg.indexOf(functionCheck.syntax[indexOfEnd])
              ),
              functionCheck.evaluate(...args)
            );
          } 
        }else{
          throw new TypeError(
            `You used function ${name}, but it is not unlocked!`
          );
          break;
        }
      }
    }
  }
}

class FactionDisplay extends HTMLElement {
  updateHTML() {
    const c = (co) => this.faction.countToDisplay(co);
    this.info.innerHTML = `Count: ${c(this.faction.count)}<br>
    Next count: ${c(this.faction.nextCount)}<br>
    Next milestone: ${c(this.faction.milestoneNextAt)}<br>
    Current amount of milestones: ${this.faction.milestones}`;
    if (this.getAttribute("name") === "Tree") {
      this.c.style.display = this.faction.count === 0 ? "none" : "block";
      this.c.width = factions.Tree.grid * 10;
      this.c.height = factions.Tree.grid * 10;
      const ctx = this.c.getContext("2d");
      ctx.clearRect(0, 0, this.c.width, this.c.height);
      ctx.fillStyle = "gray";
      ctx.fillRect(0, 0, this.c.width, this.c.height);
      ctx.fillStyle = randomColor(); //create randomColor function
      ctx.fillRect(
        0,
        0,
        this.c.width,
        Math.floor(factions.Tree.count / factions.Tree.grid) * 10
      );
      ctx.fillRect(
        0,
        Math.floor(factions.Tree.count / factions.Tree.grid) * 10,
        (factions.Tree.count % factions.Tree.grid) * 10,
        10
      );
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
    root.append(chatInstance, this.info);
    if (name === "Tree") {
      this.c = ce("canvas");
      this.c.style.border = "solid";
      root.append(this.c);
    }
    root.append(ce("br"));
    this.shadowRoot.append(root);
    this.faction.textBox.on(() => this.updateHTML(), "message");
    this.updateHTML();
  }
}

customElements.define("faction-disp", FactionDisplay);
