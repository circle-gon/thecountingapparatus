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
  get nextCount() {
    return this.count + 1;
  }

  doCount(count) {// uhhh what.
    let msg = count;
    for (const functionCheck in Object.values(Functions)){ // doesn't for in get the indices? No it gets the entire Function Object.
      if (msg.includes(functionCheck.syntax)){
        if (functionCheck.isUnlocked){
          let msgIndex = 0;
          let tmpIndex;
          let synCheck = true;
          while(msg[msgIndex] !== functionCheck.syntax[0]){
            msgIndex++;
          }
          let i = msgIndex;
          for(i; functionCheck.syntax[i-msgIndex] !== "x"; i++){
            if(msg[msgIndex+i] === functionCheck.syntax[i-msgIndex]){
              synCheck = true;
            }else{
              synCheck = false;
              break;
            }
          }
          if(synCheck){
            tmpIndex = msgIndex;
            msgIndex+=i;
            let inputVarInit = {};
            for(msgIndex;Number.isInteger(+msg[msgIndex]);msgIndex++){
              inputVarInit = inputVarInit.concat(msg[msgIndex]);
            }
            switch (msg[msgIndex]){
              case "]":
                break;
              
            }
          }else{
            break;
          }
        }else{
          break;
        }
      }else{
        continue;
      }
    }
    if (this.isCorrectCount(msg)) {
      this.count = this.nextCount;
      this.updateMilestones();
      this.updateGoals();
    }
  }
  
  get milestoneReduction(){
    return 1;
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
  
  parseCount(count) {
    return Number(count)
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
