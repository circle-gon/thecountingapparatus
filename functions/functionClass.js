//Function Objects
export const Functions = {};
export const Operators = {};
export const Left = {};
export const Right = {};
export const Wrap = {};
export const Bin = {};

export class FunctionBase {
  constructor(name, unlock, syntax, evaluate) {
    this.name = name; // Name of function
    this.unlock = unlock; // Letter unlock string
    this.syntax = syntax; // In-text Syntax
    this.evaluate = evaluate; // Function definition
    this.counter = {
      // Total count of function per function based faction
      xx: 0,
      ones: 0,
      factorial: 0,
    };
    this.banCounter = {
      // Total count of ban forgiveness usages per function
      xx: 0,
      ones: 0,
      factorial: 0,
    };
    this.isBanned = false;
    this.isUnlocked = true;
    this.isStunned = false;
  }
}