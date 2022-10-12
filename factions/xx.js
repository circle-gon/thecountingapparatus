import { FactionBase, avg, effectiveMilestones } from "./factions.js";

class XxFaction extends FactionBase {
  constructor() {
    super("X X", (x) => Math.pow(x, Math.pow(x, this.milestoneReduction)));
    this.challenges = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.hasChal = true;
    this.rawX = 1;
    this.effectiveX = 1;
    this.goals = [
      () => this.rawX >= 4,
      () => this.challenges[0] >= 100,
      () => this.challenges[7] >= 314,
      () => avg >= 5000,
      () => this.rawX >= 10
    ];
  }

  get nextCount() {
    return this.count + 1;
  }

  get milestoneReduction(){
    return 1;
  }
  
  get challengeReward() {
    let logProd = 1;
    for (const chal of this.challenges) {
      logProd *= Math.log10(chal + 1) + 1;
    }
    return Math.Pow(1/logProd, Math.max(1/(1+effectiveMilestones),1));
  }
}
export const xxCount = new XxFaction();
