import { FactionBase } from "./factions.js";
import { xxCount } from "./xx.js";
import { basicCount } from "./count.js";
import { factorialCount } from "./factorial.js";
import { getBaseLog } from "../utils/mechanics.js";

class LetterFaction extends FactionBase {
  constructor() {
    super(
      "Letter",
      (x) =>
        (Math.pow(26, Math.pow(x + 1, xxCount.milestoneReduction)) - 1) / 25
    );
    this.baseCount = this.count;
    this.extensionCount = this.count;
    //this.letterStock = 0;
    this.usedStock = 0;
  }
  get nextCount() {
    return this.NumberToLetter(this.LetterToNumber(this.count) + 1);
  }
  
  isCorrectCount(count) {
    return (
      this.nextCount === this.parseCount(count)
    );
  }
  
  parseCount(count) {
    return Number(count);
  }
  
  NumberToLetter(n) {
    if(n < 26) return (n+9).toString(36)
    if(n > 36) return n.toString(36).split("").map(n => this.NumberToLetter(n)).reduce()
    return n.toString(36); 
  }
  
  LetterToNumber(a) {
    let arr = a.split("")
    return a.split("").map((n,i) => {
      if(i == 0) return (parseInt(n,36)+9)*Math.pow(26, (a.length-i))
      return 
    }) // wait shit let me check something
    
  }  

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
}

export const letterCount = new LetterFaction();
