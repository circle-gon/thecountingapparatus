import {FactionBase} from "./factions.js"

class FactionTesting extends FactionBase {
  constructor() {
    super("Parser Testing", () => 1, [
      {
        title: "An example",
        description: "Nothing special here...",
        requirementDesc: "Nothing",
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
        requirementDesc: "Nothing",
        unlocked() {
          return false
        }
      })
    ])
  }
  get nextCount() {
    return this.count + 1
  }
  isCorrectCount() {
    return true
  }
  parseCount(count) {
    return FactionBase.parseFunction(count, this)
  }
  doCount(count) {
    try {
      //super.doCount(count)
      this.textBox.sendMessage("Result: " + this.parseCount(count))
    } catch (e) {
      this.textBox.sendMessage("invalid");
      console.error(e)
      // this.textBox.sendMessage("Failed to parse, error: " + e.stack)
    }
  }
}

export const testing = window.testing = new FactionTesting()