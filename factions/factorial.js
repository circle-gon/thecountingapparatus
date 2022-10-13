import { xxCount } from "./xx.js";
import { FactionBase } from "./factions.js";

export function gamma(z) {
  const g = 7;
  const C = [
    0.99999999999980993,
    676.5203681218851,
    -1259.1392167224028,
    771.32342877765313,
    -176.61502916214059,
    12.507343278686905,
    -0.13857109526572012,
    9.9843695780195716e-6,
    1.5056327351493116e-7
  ];

  if (z < 0.5) return Math.PI / (Math.sin(Math.PI * z) * gamma(1 - z));
  else {
    z -= 1;

    let x = C[0];
    for (let i = 1; i < g + 2; i++) x += C[i] / (z + i);

    const t = z + g + 0.5;
    return Math.sqrt(2 * Math.PI) * Math.pow(t, z + 0.5) * Math.exp(-t) * x;
  }
}

class FactorialFaction extends FactionBase {
  constructor() {
    super("Factorial", (x) =>
      Math.ceil(gamma(Math.pow(x + 2, xxCount.milestoneReduction))-0.0000001)//gamma isn't exact so the -0.0000001 prevents weird floating point things
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
    return Number(count);
  }
}
export const factorialCount = new FactorialFaction();
