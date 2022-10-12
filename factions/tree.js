import { FactionBase, factions } from "./factions.js";
import { basicCount } from "./count.js";
import { xxCount } from "./xx.js";
import { onesCount } from "./ones.js";

class TreeFaction extends FactionBase {
  constructor() {
    super("Tree", (x) => Math.pow(x+1, Math.pow(2, xxCount.milestoneReduction)));
    this.hasChal = false;
    this.rewardUsed = 0;
    this.goals = [
      () => this.milestones >= 25,
      () => this.milestones >= 50,
      () => this.rewardUsed >= 25,
      () => this.rewardUsed >= 50,
      () => this.grid >= 10
    ];
    this.grid = 0;
    this.textBox.max = 1;
  }

  //Counts & Milestones
  get nextCount() {
    return this.count + 1;
  }
  parseCount(count) {
    return Number(count)
  }
  isCorrectCount(count) {
    return count === this.nextCount.toString();
  }
  doCount(count) {
    if (this.isCorrectCount(count)) {
      this.count = this.nextCount;
      this.avg = this.updateAverage();
      this.updateGrid();
      this.updateMilestones();
      this.updateGoals();
    }
  }

  get milestoneRewards() {
    return {
      one: basicCount.spireEffect * this.milestones
    };
  }

  useReward() {
    if (this.rewardUsed <= this.milestoneRewards.one) {
      this.rewardUsed++;
      return true;
    } else {
      return false;
    }
  }

  get slowmode() {
    return 86400 * Math.pow(0.75, onesCount.milestones);
  }
  
  updateGrid() {
    this.grid = Math.ceil(Math.sqrt(this.count));
    for (const value of Object.values(factions)) {
      value.textBox.length = (this.grid + 1) * (onesCount.milestones + 1);
    }
  }
}

export const treeCount = new TreeFaction();
