import { xxCount } from "./xx.js";
import { FactionBase } from "./factions.js";
import {gamma} from '../utils/utils.js'

class FactorialFaction extends FactionBase {
  constructor() {
    super("Factorial", (x) =>
      Math.ceil(gamma(Math.pow(x + 2, xxCount.milestoneReduction))-0.0000001), [], "#E74C3C"//gamma isn't exact so the -0.0000001 prevents weird floating point things
    );
    this.challenges = [0, 0, 0];
    this.hasChal = true;
    this.challengeReward = Math.floor(
      Math.pow(
        this.challenges[0] + this.challenges[1] + this.challenges[2],
        1 / 2
      )
    );
    
  }
  
  parseCount(count) {
    return FactionBase.parseFunction(count,this);
  }
}
export const factorialCount = new FactorialFaction();
