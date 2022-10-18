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
    this.count = [0];
    this.hasChal = false;
    //this.letterStock = 0;
    //this.usedStock = 0;
  }

  get baseCount() {
    return this.count[0];
  }

  get extensionCount() {
    let a = 0;
    for (let i = 0; i < this.count.length; i++) {
      a += 26 ** i * this.count[i];
    }
    return a;
  }

  get usedStock() {
    let a = 0;
    for (let i = 0; i < this.count.length; i++) {
      a += i * this.count[i];
    }
    return a;
  }

  //Counting Logic
  isCorrectCount(count) {
    console.log(count, this.count);
    const maxStockIndex = Math.max(...this.count)
    const maxDigitIncr = Math.max(maxStockIndex, this.digitLength);
    const difference = this.LetterToNumber(count) - this.extensionCount;
    if (difference === 0) return false;
    if (difference === 1) {
      this.count = this.nextCount
      return true;
    }
    const oom = Math.log(Math.abs(difference)) / Math.log(26);

    if (oom % 1 === 0) {
      if (oom > maxDigitIncr - 1) return false;
      const remainingStock = this.letterStock - this.usedStock
      if (this.count[oom] == undefined) this.count[oom] = 0;
      if (
        remainingStock >= oom ||
        (Math.sign(this.count[oom]) === -1 && Math.sign(difference) === 1) ||
        (Math.sign(this.count[oom]) === 1 && Math.sign(difference) === -1)
      ) {
        this.count[oom] += Math.sign(difference);
        return true;
      } else return false;
    } else return false;
    //return count === this.NumberToLetter(this.nextCount)
  }

  doCount(count) {
    if (this.isCorrectCount(count)) {
      //this.count[1] = this.nextCount; // going to take care of changing count in the isCorrectCount()
      //console.log(this.count);
      this.unlockFunction();
      this.updateMilestones();
      this.updateGoals();
    }
  }
  get digitLength() {
    let count = Math.max(this.baseCount, this.extensionCount);
    return Math.floor(Math.log(25 * count + 1) / Math.log(26));
  }

  get nextCount() {
    let sum = 0;
    for (let i = 0; i < this.digitLength; i++) {
      sum += this.count[i] * 26 ** i;
    }
    return sum + 1;
  }

  countToDisplay(count) {
    return this.NumberToLetter(count);
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
  unlockFunction() {
    for (const unlockCheck of Object.values(Functions)) {
      if (
        unlockCheck.isUnlocked ||
        letterCount.baseCount === unlockCheck.unlock ||
        letterCount.extensionCount === unlockCheck.unlock
      ) {
        unlockCheck.isUnlocked = true;
      } else {
        unlockCheck.isUnlocked = false;
      }
    }
  }

  //Letter Stock Mechanics
  get letterStock() {
    return basicCount.milestones + factorialCount.challengeReward;
  }

  //Spire Boost
}

export const letterCount = new LetterFaction();
