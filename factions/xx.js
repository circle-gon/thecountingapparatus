import { FactionBase } from "./factions.js";
import { Functions } from "../functions/functionClass.js";

class XxFaction extends FactionBase {
  constructor() {
    super("X X", (x) =>
      Math.pow(x + 1, Math.pow(x + 1, this.milestoneReduction))
    );
    this.challenges = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.challengeXs = [
      0,
      1,
      Math.sqrt(2),
      Math.pow(Math.E, 1 / Math.E),
      0.5 * (1 + Math.sqrt(5)),
      (Math.PI * 2) / (0.5 * (1 + Math.sqrt(5))) ** 2,
      Math.E,
      Math.PI,
      3.359885666243177553,
      "i",
    ];
    this.hasChal = true;
    this.goals = [
      () => this.rawX >= 4,
      () => this.challenges[0] >= 100,
      () => this.challenges[7] >= 314,
      () => this.avg >= 5000,
      () => this.rawX >= 10,
    ];
    this.inChal = 0;
  }

  //Counting & Milestones

  isCorrectCount(count) {
    if(count.toLowerCase().startsWith("enter") || count.toLowerCase().startsWith("exit")){
      if(count.toLowerCase().startsWith("enter")){
        if(!isNaN(Number(count[count.length-1]))){
          this.inChal = (Number(count[count.length-1])+9)%10 + 1 //turning 0 into 10
          this.rawX = this.challengeXs[Number(count[count.length-1])]
        }
      }else {
        this.inChal = 0;
        this.rawX = this.milestones+1;
      }
      this.nextCount = (this.inChal == 0 ? this.count+1 : this.challenges[this.inChal-1]+1)
      return true;
    }
    if (!count.includes("=")) return false;
    let number = count.split("=")[0];
    if(Number(number) != this.nextCount)return false;
    let actualCount = count.split("=")[1];
    let amountOfX = actualCount.match(new RegExp(this.rawX, "g"));
    let ruleFollowed = amountOfX == Math.ceil(this.rawX == "i" ? 1 : this.rawX);
    if (ruleFollowed) {
      let numbersUsed = actualCount.match(/\d+/g);
      for (let i = 0; i < numbersUsed.length; i++) {
        if (Number(numbersUsed[i]) != this.rawX) {
          ruleFollowed = false;
        }
      }
    }
    return (
      // this.nextCount === this.parseCount(count)
      Math.abs(this.nextCount - this.parseCount(actualCount)) < 0.00000001 &&
      ruleFollowed
    );
  }

  get milestoneReduction() {
    return 1;
  }

  get rawX() {
    return this.milestones + 1;
  }
  get effectiveX() {
    return this.milestones + 1;
  }

  parseCount(count) {
    return FactionBase.parseFunction(count, this);
  }

  get challengeReward() {
    let logProd = 1;
    for (const chal of this.challenges) {
      logProd *= Math.log10(chal + 1) + 1;
    }
    return Math.pow(
      1 / logProd,
      Math.max(1 / (1 + this.effectiveMilestones), 1)
    );
  }
}
export const xxCount = new XxFaction();
