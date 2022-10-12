import { FactionBase, totalMilestones, effectiveMilestones } from "./factions.js";
import { xxCount } from "./xx.js";
import { basicCount } from "./count.js";
import { factorialCount } from "./factorial.js";
import { getBaseLog, updateTotalMilestones, updateEffectiveMilestones } from "../utils/mechanics.js";

class LetterFaction extends FactionBase {
  constructor() {
    super(
      "Letter",
      (x) =>
        ((Math.pow(26, Math.pow(x + 2, xxCount.milestoneReduction)) - 1)/25)-1
    );
    this.baseCount = this.count;
    this.extensionCount = this.count;
    this.hasChal = false;
    //this.letterStock = 0;
    this.usedStock = 0;
  }
  
  //Counting Logic
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
  
  updateMilestones() {
    const oldMilestone = this.milestones;
    while (this.count >= this.milestoneNextAt) {
      this.milestones++;
    }
    if (this.milestones > oldMilestone) {
      this.onMilestone();
      totalMilestones = updateTotalMilestones();
      effectiveMilestones = updateEffectiveMilestones();
    }
  }
  
  //Letter-Number Conversion
  NumberToLetter(n) {
    let out = 0;
    for(let i = n; i > getLogBase(n);i--) {
      
    }
    
  }

  LetterToNumber(a) { // WHY IS THIS BEING FED 0
    let out = 0
    for(let i = 0; i < a.length; i++) {
      out = out * 26 + parseInt(a.substr(i,1),36)-9
    }
    return out
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
