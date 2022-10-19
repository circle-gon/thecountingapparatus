//Function Objects
export const Functions = {};
export const Operators = {};
export const Left = {};
export const Right = {};
export const Wrap = {};
export const Bin = {};

export class FunctionBase {
  constructor(name, unlock, syntax, evaluate, expectedArgs = []) {
    this.name = name; // Name of function
    this.unlock = unlock; // Letter unlock string
    this.syntax = syntax; // In-text Syntax
    this.evaluate = evaluate; // Function definition
    this.expectedArgs = expectedArgs; // Parser aid to know how many functions it needs to find, and how far apart they are (list of distances between arguments, one arg just has [])
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
