import {FactionBase} from "./factions.js"

class FactionTesting extends FactionBase {
  constructor() {
    super("Parser Testing", () => 1, [
      {
        title: "An example",
        description: "Nothing special here...",
        onStart() {
          alert("Challenge started!")
        },
        onExit() {
          alert("challenge exited!")
        },
        unlocked() {
          return true
        }
      }, ...Array(20).fill({
        title: "Another example",
        description: "Something...",
        unlocked() {
          return true
        }
      })
    ])
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
      this.textBox.sendMessage("Result: " + this.parseCount(count))
    } catch (e) {
      this.textBox.sendMessage("invalid");
      console.error(e)
      // this.textBox.sendMessage("Failed to parse, error: " + e.stack)
    }
  }
}

export const testing = window.testing = new FactionTesting()