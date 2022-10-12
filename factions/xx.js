import { FactionBase } from "./faction.js";

/*function getEffectiveMilestones(){
  let effectiveMilestones = 0;
  for (const value of Object.values(globalInfo.factions)) {
    if(["Letter", "Factorial", "Matrix", "Function"].includes(value.name))
      effectiveMilestones -= value.milestone;
  	else effectiveMilestones += value.milestone;
  }
  return effectiveMilestones
}
function getTotalMilestones(){
  let totalMilestones = 0;
  for (const value of Object.values(globalInfo.factions)) {
  	totalMilestones += value.milestone;
  }
  return totalMilestones
}
function updateMilestoneReduction() {
    //updates milestone scaling reduction on each milestone
	let effectiveMilestones = getEffectiveMilestones()
  milestoneReduction = Math.pow(1/xxCount.logProd, Math.max(1/(effectiveMilestones+1),1));
  document.getElementById("milestoneReductionText").innerHTML = "Milestone reduction: " + milestoneReduction.toFixed(2);
  for (const value of Object.values(globalInfo.factions)) {
  	value.checkMilestoneReq();
  }
}

let milestoneReduction = 1;*/

class XxFaction extends FactionBase {
  constructor() {
    // testing testing
    //okay?
    super("X X", (x) => Math.pow(x, Math.pow(x, this.milestoneReduction)));
    this.challenges = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.rawX = 1;
    this.effectiveX = 1;
    this.goals = [
      () => this.rawX >= 4,
      () => this.challenges[0] >= 100,
      () => this.challenges[7] >= 314,
      () => 1 /*Average of all R1 factions/challenges*/ >= 5000,
      () => this.rawX >= 10
    ];
  }

  get nextCount() {
    return this.count + 1;
  }

  get milestoneReduction() {
    return 1; // placeholder for now
  }

  get challengeReward() {
    let logProd = 1;
    for (const chal of this.challenges) {
      logProd *= Math.log10(chal + 1) + 1;
    }
    return Math.Pow(1 / logProd, 1 /*/effectiveMilestones*/);
  }
}
export const xxCount = new XxFaction();
