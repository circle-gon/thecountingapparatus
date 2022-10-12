import { FactionBase } from "/sandbox/utils/faction.js";
import { xxCount } from "./xx.js";
import { basicCount } from "./count.js";
import { factorialCount } from "./factorial.js";

class LetterFaction extends FactionBase {
  constructor() {
    super(
      "Letter",
      (x) =>
        (Math.pow(26, Math.pow(x + 1, xxCount.milestoneReduction)) - 1) / 25
    );
    this.baseCount = this.count;
    this.extensionCount = this.count;
    this.letterStock = 0;
    this.usedStock = 0;
  }
  nextCount() {
    return this.NumberToLetter(this.LetterToNumber(this.count) + 1);
  }
  NumberToLetter(n) {
    return n.toString(36);
  }
  LetterToNumber(a) {
    return parseInt(a, 36);
  }

  get letterStock() {
    return basicCount.milestones + factorialCount.challengeReward;
  }
  useStock(index, amount, countText) {
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
  }
}

export const letterCount = new LetterFaction();
