import { FactionBase } from "./factions.js";
import { Functions } from "../functions/functionClass.js";

class XxFaction extends FactionBase {
  constructor() {
    super("X X", (x) => Math.pow(x+1, Math.pow(x+1, this.milestoneReduction)));
    this.challenges = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.hasChal = true;
    this.rawX = 1;
    this.effectiveX = 1;
    this.goals = [
      () => this.rawX >= 4,
      () => this.challenges[0] >= 100,
      () => this.challenges[7] >= 314,
      () => this.avg >= 5000,
      () => this.rawX >= 10
    ];
  }

  //Counting & Milestones

  doCount(count) {
    count = this.parseFunction(count,this)
    if (this.isCorrectCount(count)) {
      this.count = this.nextCount;
      this.updateMilestones();
      this.updateGoals();
    }
  }
  
  get milestoneReduction(){
    return 1;
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
    }
    this.effectiveX = this.milestones+1;
    this.rawX = this.milestones+1;
  }
  
  get challengeReward() {
    let logProd = 1;
    for (const chal of this.challenges) {
      logProd *= Math.log10(chal + 1) + 1;
    }
    return Math.pow(1/logProd, Math.max(1/(1+this.effectiveMilestones),1));
  }
}
export const xxCount = new XxFaction();
