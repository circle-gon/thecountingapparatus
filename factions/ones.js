import { xxCount } from "./xx.js";
import { FactionBase } from "./faction.js";

class OnesFaction extends FactionBase {
  constructor() {
    super(
      "Ones",
      (x) => Math.pow(10, Math.pow(x, xxCount.milestoneReduction)) / 9
    );
    this.challengeReward = Math.floor(
      Math.pow(
        this.challenges[0] + this.challenges[1] + this.challenges[2],
        1 / 3
      )
    );
    this.challenges = [0, 0, 0];
  }
  get nextCount() {
    return this.count + 1;
  }
}

export const onesCount = new OnesFaction();
