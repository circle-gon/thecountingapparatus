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
    this.hasChal = false;
    //this.letterStock = 0;
    this.usedStock = 0;
  }
  get nextCount() {
    return this.NumberToLetter(this.count+1);
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
    if(n < 26) return (n+9).toString(36).toUpperCase();
    if(n > 36) return n.toString(36).split("").map(n => this.NumberToLetter(n)).reduce()
    return n.toString(36); 
  }
  
  LetterToNumber(a) { // WHY IS THIS BEING FED 0
    let temp = a.toLowerCase()
    while(temp.indexOf("z") !== -1) {
      temp = temp.replace(/.z/g,(match)=>{
        return (parseInt(match[0],35)+1).toString(35)+"a"
      })
    }
    return parseInt(temp,35)
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
