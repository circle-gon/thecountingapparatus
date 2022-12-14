import { FactionBase } from "./factions.js";
import { xxCount } from "./xx.js";

class CountFaction extends FactionBase {
  //Constructor
  constructor() {
    super("Classic", (x) =>
      Math.ceil(Math.pow(10, Math.pow(x + 1, xxCount.milestoneReduction))), [], "#EAA221"
    );
    this.hasChal = false;
    this.rewardOneUsed = 0;
    this.spireEffect = 1;
    this.goals = [
      () => this.milestones >= 5,
      () => this.milestones >= 10,
      () => this.rewardUsed >= 10,
      () => this.rewardUsed >= 50,
      () => this.count >= 1e6,
    ];
  }

  //Count & Milestones
  get nextCount() {
    return this.realCount + Math.max(xxCount.effectiveX, 1);
  }

  get milestoneRewards() {
    return {
      one:
        (this.spireEffect * (Math.pow(this.milestones, 2) + this.milestones)) /
        2,
      two: this.milestones,
    };
  }

  isCorrectCount(count) {
    return count === this.nextCount.toString();
  }
  useRewardOne() {
    if (this.rewardOneUsed < this.milestoneRewards.one) {
      this.rewardUsed++;
      return true;
    } else {
      return false;
    }
  }
  doCount(count) {
    if (this.isCorrectCount(count)) {
      if (this.inChallenge !== null) {
        this.challenges[this.inChallenge] = this.nextCount;
      } else {
        this.count = this.nextCount;
        this.updateMilestones();
      }
      this.updateGoals();
    } else if (
      count.startsWith("unban") &&
      this.rewardOneUsed < this.milestoneRewards.one
    ) {
      this.useRewardOne();
    }
  }
  spireBoost() {
    if (this.isSpire) {
      this.textBox.changeChannelName("Finite Spire");
      this.spireEffect = 2;
    } else {
      this.textBox.changeChannelName("Classic");
      this.spireEffect = 1;
    }
  }
}
export const basicCount = new CountFaction();
