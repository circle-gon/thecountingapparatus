import {FactionBase} from "./factions.js"

class FactionTesting extends FactionBase {
  constructor() {
    super("Parser Testing", () => 1)
  }
  get nextCount() {
    return "anything"
  }
  isCorrectCount() {
    return true
  }
  parseCount(count) {
    return FactionBase.parseFunction(count, this)
  }
  doCount(count) {
    try {
      super.doCount(count)
      this.textBox.sendMessage(this.parseCount(count))
    } catch (e) {
      this.textBox.sendMessage("Failed to parse, error: " + e.toString())
    }
  }
}

export const testing = window.testing = new FactionTesting()