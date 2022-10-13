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
}

export const onesCount = new OnesFaction();
