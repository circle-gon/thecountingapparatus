//Imports
import { ce, TextChannel } from "../text/channel.js";
import { escapeHtml, randomColor } from "../utils/utils.js";
import { Functions, Operators, Left, Right, Wrap, Bin } from "../functions/functionClass.js";

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
    throw new ParserError("Unimplemented...")
    
    //Checking highest parenDepth
    let parenDepthMax = 0;
    let indexOfMaxDepthStart = 0;
      if(msg.includes("(")){
        let parenCheck = msg.indexOf("(");
        do {
          let parenDepth = 0;
          if (parenCheck > msg.length - 1)
            // we're past the end, the user inputted an invalid string
            throw new ParserError(
              `You are missing ${parenDepth} closing parentheses. Please check your syntax!`
            );
          if (msg[parenCheck] === "(") parenDepth++; // increase parenDepth because we see a (
          if (msg[parenCheck] === ")") parenDepth--; // decrease parenDepth because we see a (
          
          //Checking for index of maximum depth
          if (parenDepthMax < parenDepth){
            parenDepthMax = Math.max(parenDepth,parenDepthMax);
            indexOfMaxDepthStart = parenCheck;
          }
          parenCheck++;
        } while (msg[parenCheck] > 0);
        
        //Creating the deepest parenDepth
        let subMsg = msg.substring(indexOfMaxDepthStart);
        subMsg = subMsg.substring(0,subMsg.indexOf(")"));
        
        //Operate on the deepest parenDepth
        for (const opCheck of Object.values(Operators)) {
          while (subMsg.includes(opCheck.symbol)){
            let op = subMsg.indexOf(opCheck.syntax);
            let args = [];
            switch (Object.getPrototypeOf(opCheck).constructor.name){
              case Left.name:
                let findArg = op;
                do{
                  args[0] = args[0].concat(++findArg)
                }while(isNaN(Number(subMsg[findArg])))
            }
          }
        }
        if(parenCheck !== 0) this.parseOperator(msg, faction);
      }
  }//[["literal",3],["operator","+"],["literal",3],["operator","+"],["literal",3]]

  static parseFunction(msg, faction) {
    throw new ParserError("Unimplemented...")
    msg = msg.replaceAll(" ", ""); //
    for (const functionCheck of Object.values(Functions).filter(
      (i) => !(i instanceof Operators)
    )) {

      //s
      const startOfArgs = functionCheck.syntax.indexOf("(");
      // first point where the ( is seen
      // abc(x,y,z) yields 3
      const name = functionCheck.syntax.substring(0, startOfArgs); // name of function
      // yields abc
      while (msg.includes(name)) {
        if (functionCheck.isUnlocked) {
          const start = msg.indexOf(functionCheck.syntax[0]); // start of where we see the syntax
          // so abc(1,2,3) (with function defined as abc(x,y,z)) yields 0
          let indexOfEnd = start + name.length;
          // end of name
          // abc(1,2,3) yields 3
          let parenDepth = 0;
          // how far we are in a function
          const args = [];
          // arguments to the function
          let argsText = "";
          // text of what the argument is
          // so for abc(1,2,3), it would take on 3 values: 1, 2, and 3
          // and for abc(5*5,A(5,5),9999), it would have also 3 values: 5*5, A(5,5), and 9999
          // note whitespace is stripped
          do {
            if (indexOfEnd > msg.length - 1)
              // we're past the end, the user inputted an invalid string
              throw new ParserError(
                `You are missing ${parenDepth} closing parentheses. Please check your syntax!`
              );
            const text = msg[indexOfEnd];
            // text at that point
            if (text === "(") parenDepth++;
            // increase parenDepth because we see a (
            if (text === ")") parenDepth--;
            // same as above but for decreasing
            if (parenDepth === 1 && text === ",") {
              // this is an arg to the original
              args.push(argsText);
              argsText = "";
            } else {
              // increment the text
              argsText += text;
            }
            // increment string
            indexOfEnd++;
          } while (parenDepth > 0);
          const correctArgs = functionCheck.syntax
            .substring(
              functionCheck.syntax.indexOf("(") + 1,
              functionCheck.syntax.indexOf(")")
            )
            // this splits from the start of the inside of the function to
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
          }
          msg = msg.replace(
            msg.substring(start, msg.indexOf(")", indexOfEnd)),
            functionCheck.evaluate(...args)
          );
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
