import { xxCount } from "./xx.js";
import { FactionBase } from "./factions.js";

class OnesFaction extends FactionBase {
  constructor() {
    super(
      "Ones",
      (x) => Math.floor(Math.pow(10, Math.pow(x+1, xxCount.milestoneReduction)) / 9)
    );
    this.challenges = [0, 0, 0];
    this.hasChal = true;
    this.challengeReward = Math.floor(
      Math.pow(
        this.challenges[0] + this.challenges[1] + this.challenges[2],
        1 / 3
      )
    );
  }
  
  parseCount(count) {
    return FactionBase.parseFunction(count,this);
  }
  isCorrectCount(count) {
    if (!count.includes("=")) return false;
    let number = count.split("=")[0];
    if(Number(number) != this.nextCount)return false;
    let actualCount = count.split("=")[1];
    let numbersUsed = actualCount.match(/\d+/g);
    let ruleFollowed = true
    for (let i = 0; i < numbersUsed.length; i++) {
        if (Number(numbersUsed[i]) != 1) {
          ruleFollowed = false;
        }
      }
    return (
      // this.nextCount === this.parseCount(count)
      Math.abs(this.nextCount - this.parseCount(actualCount)) < 0.00000001 &&
      ruleFollowed
    );
  }
}

export const onesCount = new OnesFaction();
