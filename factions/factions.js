//Imports
import { ce, TextChannel } from "../utils/text.js";
import { escapeHtml, randomColor } from "../utils/utils.js";
import { Functions, Operators/*, Operator*/ } from "../functions/functionClass.js";
// import { Operator } from "../functions/functionList.js";

//Factions Objects
export const factions = {};

//Faction superclass

// base class to differernate standard js errors vs compilation errors
class ParserError extends Error {}

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
    for (const opCheck of Object.values(Operators)) {
      // 3+3+3
      let op = msg.indexOf(opCheck.syntax);
    }
  } //[["literal",3],["operator","+"],["literal",3],["operator","+"],["literal",3]]
  static parseFunction(msg, faction) {
    msg = msg.replaceAll(" ", ""); //
    for (const functionCheck of Object.values(Functions).filter(
      (i) => !(i instanceof Operator)
    )) {
      //synCheck
      const name = functionCheck.syntax.substring(
        0,
        functionCheck.syntax.indexOf("(")
      ); // pretty sure no ! is supposed to be here
      while (msg.includes(name)) {
        if (functionCheck.isUnlocked) {
          const start = msg.indexOf(functionCheck.syntax[0]);
          const parenCheck = msg.substring(start);
          let indexOfEnd = parenCheck + name.length;
          let parenDepth = 0;
          const args = [];
          let argsText = "";
          // also pushing every single time....
          // also I can't access discord so type it in here
          do {
            if (indexOfEnd > msg.length - 1)
              throw new ParserError(
                `You are missing ${parenDepth} closing parentheses. Please check your syntax!`
              );
            const text = msg[indexOfEnd];
            if (text === "(") parenDepth++;
            if (text === ")") parenDepth--;
            if (parenDepth === 1 && text === ",") {
              args.push(argsText);
              argsText = "";
            } else {
              argsText += text;
            }
            indexOfEnd++;
          } while (parenDepth > 0);
          const correctArgs = functionCheck.syntax
            .substring(name + 1, indexOfEnd)
            .split(",");
          if (args.length !== correctArgs.length)
            // do it here to prevent people killing the program by adding 10000000 arguments
            throw new ParserError(
              `Invalid number of arguments passed to ${name}: ${args.length}` +
                `arguments passed, but ${correctArgs.length} arguments required.` +
                "Please check your syntax!"
            );
          for (const [i, arg] of args.entries()) {
            if (isNaN(Number(arg))) {
              args[i] = this.parseOperator(
                this.parseFunction(arg, faction),
                faction
              );
            }
            msg = msg.replace(
              msg.substring(
                start,
                msg.indexOf(functionCheck.syntax[indexOfEnd])
              ),
              functionCheck.evaluate(...args)
            );
          }
        } else {
          throw new ParserError(
            `You used function ${name}, but it is not unlocked!`
          );
          // throw automatically stops stuff
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
      for (let x = 0; x < factions.Tree.count; x++) {
        ctx.fillRect(
          0,
          0,
          this.c.width,
          Math.floor(factions.Tree.count / factions.Tree.grid) * 10
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
