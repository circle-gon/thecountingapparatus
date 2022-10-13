import { FactionBase } from "./factions.js";
import { xxCount } from "./xx.js";
import { basicCount } from "./count.js";
import { factorialCount } from "./factorial.js";
import { Functions } from "../functions/functionClass.js";

class LetterFaction extends FactionBase {
  constructor() {
    super("Letter", (x) =>
      Math.ceil(
        (Math.pow(26, Math.pow(x + 2, xxCount.milestoneReduction)) - 1) / 25 - 1
      )
    );
    this.baseCount = this.count;
    this.extensionCount = this.count;
    this.hasChal = false;
    //this.letterStock = 0;
    this.usedStock = 0;
  }

  //Counting Logic
  get nextCount() {
    return this.count + 1
  }
  
  isCorrectCount(count) {
    return count === this.NumberToLetter(this.nextCount)
  }
  doCount(count) {
    if (this.isCorrectCount(count)) {
      this.count = this.nextCount;
      this.updateMilestones();
      this.updateGoals();
    }
  }
  countToDisplay(count) {
    return this.NumberToLetter(count)
  }

  //Letter-Number Conversion
  NumberToLetter(n) {
    let str = "";
    while (n > 0) {
      let mod = n % 26;
      if (mod === 0) {
        mod = 26;
        n -= 26;
      }
      str = String.fromCharCode(mod + 64) + str;
      n = Math.floor(n / 26);
    }
    return str;
  }

  LetterToNumber(a) {
    let out = 0;
    for (let i = 0; i < a.length; i++) {
      out = out * 26 + parseInt(a.substr(i, 1), 36) - 9;
    }
    return out;
  }

  //Function Mechanics
    unlockFunction(){
    for (const unlockCheck of Object.values(Functions){
      if (unlockCheck..isUnlocked || letterCount.baseCount === this.unlock) {
      
      }
    }
  }
  
  //Letter Stock Mechanics
  get letterStock() {
    return basicCount.milestones + factorialCount.challengeReward;
  }
  /*useStock(index, amount, countText) {
    if (
      getBaseLog(this.baseCount + 1, 26) > index ||
      getBaseLog(this.extensionCount + 1, 26) > index
    ) {
      if (this.parseCount(countText) > this.extensionCount) {
        this.incrementCount(amount, countText);
        this.extensionCount = this.count;
        this.count = this.baseCount;
        if (this.extensionCount > this.baseCount) {
          this.usedStock += index;
        } else {
          this.usedStock -= index;
        }
      } else {
        this.incrementCount(-amount, countText);
        this.extensionCount = this.count;
        this.count = this.baseCount;
        if (this.extensionCount < this.baseCount) {
          this.usedStock += index;
        } else {
          this.usedStock -= index;
        }
      }
    } else {
      return false;
    }
  }*/

  //Spire Boost
}

export const letterCount = new LetterFaction();
