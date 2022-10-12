import { factions } from "../factions/factions.js";

export function updateEffectiveMilestones(){
  let stoneCount = 0;
  for (const value in Object.values(factions)){
    if(value.name == "Letter" || value.name == "Factorial"){
      stoneCount -= value.milestones;
    }else{
      stoneCount += value.milestones;
    }
  }
  return stoneCount;
}

export function updateTotalMilestones(){
  let stoneCount = 0;
  for (const value in Object.values(factions)){
    stoneCount += value.milestones;
  }
  return stoneCount;
}

export function updateAverage(){
  let average = 0;
  let counter = 0;
  for (const value in Object.values(factions)){
    average += value.count
    counter++
    if(value.hasChal){
      for(let i = 0;i<value.challenges.length;i++){
        average += value.challenges[i];
        counter++;
      }
    }
  }
  return average/counter;
}

export function getBaseLog(x, y){
  return Math.log(x)/Math.log(y);
}