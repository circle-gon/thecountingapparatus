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
    /*if(count.toLowerCase().startsWith("enter") || count.toLowerCase().startsWith("exit")){
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
    }*/
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
}

export const onesCount = new OnesFaction();
