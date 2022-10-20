import { FactionBase } from "./factions.js";
import { Functions } from "../functions/functionClass.js";

class XxFaction extends FactionBase {
  constructor() {
    super("X X", (x) =>
      Math.pow(
        x + 1,
        Math.pow(x + 1, this.milestoneReduction),
        [
          0,
          1,
          Math.sqrt(2),
          Math.pow(Math.E, 1 / Math.E),
          0.5 * (1 + Math.sqrt(5)),
          (Math.PI * 2) / (0.5 * (1 + Math.sqrt(5))) ** 2,
          Math.E,
          Math.PI,
          3.359885666243177553,
          "i",
        ].map((i, ind) => ({
          name: `XX Challenge ${ind}`,
          description: `X = ${i}`,
          onStart() {
            this.rawX = i
          },
          onExit() {
            this.rawX = this.milestones + 1
          }
        }))
      )
    );
    this.hasChal = true;
    this.goals = [
      () => this.rawX >= 4,
      () => this.challenges[0] >= 100,
      () => this.challenges[7] >= 314,
      () => this.avg >= 5000,
      () => this.rawX >= 10,
    ];
  }

  //Counting & Milestones

  isCorrectCount(count) {
    const lowerCaseCount = count.toLowerCase();
    if (
      lowerCaseCount.startsWith("enter") ||
      lowerCaseCount.startsWith("exit")
    ) {
      if (lowerCaseCount.startsWith("enter")) {
        // space included
        const num = count.toLowerCase.substring(7);
        try {
          this.enterChallenge(Number(num))
        } catch (e) {
          this.textBox.sendMessage(`Challenge ${num} either does not exist or is not unlocked.`)
          return false;
        }
      } else {
        this.exitChallenge()
      }
      return true;
    }
    if (!count.includes("=")) return false;
    let number = count.split("=")[0];
    if (Number(number) !== this.nextCount) return false;
    let actualCount = count.split("=")[1];
    const amountOfX = actualCount.match(new RegExp(this.rawX, "g"));
    const ruleFollowed =
      amountOfX === Math.ceil(this.rawX === "i" ? 1 : this.rawX);
      let numbersUsed = actualCount.match(/\d+/g);
      for (let i = 0; i < numbersUsed.length; i++) {
        if (Number(numbersUsed[i]) !== this.rawX) {
          return false;
        }
      }
    return (
      // this.nextCount === this.parseCount(count)
      Math.abs(this.nextCount - this.parseCount(actualCount)) < 0.00000001
    );
  }

  get milestoneReduction() {
    return 1;
  }

  get rawX() {
    return this.milestones + 1;
  }
  get effectiveX() {
    return this.milestones + 1;
  }

  parseCount(count) {
    return FactionBase.parseFunction(count, this);
  }

  get challengeReward() {
    let logProd = 1;
    for (const chal of this.challenges) {
      logProd *= Math.log10(chal + 1) + 1;
    }
    return Math.pow(
      1 / logProd,
      Math.max(1 / (1 + this.effectiveMilestones), 1)
    );
  }
}
export const xxCount = new XxFaction();
