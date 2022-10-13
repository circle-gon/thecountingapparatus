import {letterCount} from '../factions/letter.js';

//Function Objects
export const Functions = {}

export class FunctionBase {
  constructor (name, unlock, syntax, evaluate){
    this.name = name;            // Name of function
    this.unlock = unlock;        // Letter unlock string
    this.syntax = syntax;        // In-text Syntax
    this.evaluate = evaluate;    // Function definition
    this.counter = {             // Total count of function per function based faction
      xx: 0,
      ones: 0,
      factorial: 0
    };
    this.banCounter = {          // Total count of ban forgiveness usages per function
      xx: 0,
      ones: 0,
      factorial: 0
    };
    this.isBanned = false;
    this.isUnlocked = false;    
    /*this.isStunned = false;*/
  }

  validate(){
    // tentative function validation
    return this.semantics(arguments)
  }
  
  increment(){
    
  }
}

export function toNumber(str) {
  try {
    return Function("proxy", `
      with (proxy) {
        ${str}
      }
    `)
  } catch (e) {
    throw e
  }
}