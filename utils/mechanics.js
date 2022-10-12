import { factions } from "../factions/factions.js";

export function updateEffectiveMilestones(){
  let stoneCount = 0;
  for (const value in Object.values(factions)){
    if(value.name == "Letter" || value.name == "Factorial"){
      stoneCount -= 
    }
  }
}

export function updateTotalMilestones(){
  let stoneCount = 0;
}

export function updateAverage(){
  let avg = 0;
  let counter = 0;
  for (const value in Object.values(factions)){
    avg += value.count
    counter++
    if(value.hasChal){
      for(let i = 0;i<value.challenges.length;i++){
        avg += value.challenges[i];
        counter++;
      }
    }
  }
  return avg/counter;
}

export function getBaseLog(x, y){
  return Math.log(x)/Math.log(y);
}