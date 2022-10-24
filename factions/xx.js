import { FactionBase } from "./factions.js";
import { Functions } from "../functions/functionClass.js";

class XxFaction extends FactionBase {
  constructor() {
    super(
      "X X",
      (x) => Math.pow(x + 1, Math.pow(x + 1, this.milestoneReduction)),
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
        title: `XX Challenge ${ind+1}`,
        description: `X = ${i}`,
        x: i,
      })),
      "grey"
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
    if (!count.includes("=")) return false;
    const number = count.split("=")[0];
    if (Number(number) !== this.nextCount) return false;
    const actualCount = count.split("=")[1];
    const amountOfX =
      actualCount.match(new RegExp(this.rawX, "g"))?.length ?? 0;
    if (amountOfX !== Math.ceil(this.rawX === "i" ? 1 : this.rawX))
      return false;
    const numbersUsed = actualCount.match(/\d+/g);
    for (const numberUsed of numbersUsed) {
      if (Number(numberUsed) !== this.rawX) {
        return false;
      }
    }
    return (
      // this.nextCount === this.parseCount(count)
      Math.abs(this.nextCount - this.parseCount(actualCount)[0]) < 0.00000001
    );
  }

  get milestoneReduction() {
    return 1;
  }

  get rawX() {
    return this.inChallenge === null
      ? this.milestones + 1
      : this.challengeDetails[this.inChallenge].x;
  }
  get effectiveX() {
    return this.milestones + 1;
  }

  parseCount(count) {
    return FactionBase.parseFunction(count, this);
  }

  doCount(count) {
    const lowerCaseCount = count.toLowerCase();
    if (
      lowerCaseCount.startsWith("enter") ||
      lowerCaseCount.startsWith("exit")
    ) {
      if (lowerCaseCount.startsWith("enter")) {
        // space included
        const num = lowerCaseCount.substring(6);
        try {
          this.enterChallenge(Number(num) - 1);
          this.textBox.sendMessage(`Entering challenge ${num}`);
        } catch (e) {
          this.textBox.sendMessage(
            `Challenge ${num} either does not exist or is not unlocked.`
          );
        }
      } else {
        const chall = this.inChallenge;
        this.exitChallenge();
        this.textBox.sendMessage(`You exited challenge ${chall + 1}!`);
      }
    } else {
      super.doCount(count);
    }
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
