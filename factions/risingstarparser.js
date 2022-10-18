import {
  FUNCTIONS
} from "../functions/functionList.js";

export function parse2(str) {
  // find all the actual numbers and their indexes
  const literals = str.match(/\d+/g); // this doesn't get index gwa
  let literalsIndexes = [];
  let replaceString = str;
  for (let i = 0; i < literals.length; i++) {
    //get first index, literals is ordered
    let index = replaceString.indexOf(literals[i]);
    literalsIndexes.push(index);
    // replace the index with a not number of same length
    replaceString = replaceString.replace(literals[i], new Array(literals[i].length + 1).join("a"));
  }
  
  // going through the literals, look for the longest valid function
  // start left, then right, then binary, then enclosing
  // if a function has multiple args, wait until all other args are literals - if there's a non literal in the way, wait/something's wrong
  // if something's processed, collapse it and adjust literals/indexes
  // can process a maximum number of times == length of string (hopefully a vast overestimate, but safe)
  let adaptedStr = str;
  for (let notUsed = 0; notUsed < str.length; notUsed++) {
    // check literals in order, if nothing happens, check next
    for (let i = 0; i < literals.length; i++) {
      // left existence
      let foundFunction = null;
      for (let distanceLeft = 1; distanceLeft <= literalsIndexes[i]; distanceLeft++) {
        // find if there's a function with fitting syntax
        // ignore brackets if no function has been found yet
        let subString = adaptedStr.substring(literalsIndexes[i] - distanceLeft, literalsIndexes[i]);
        if (foundFunction == null) {
          subString = subString.replace(/[()]/g, '');
        }
        const actualFunc = Object.values(FUNCTIONS).find(
          (i) => i.syntax.substring(0, i.syntax.indexOf("(")) === subString
        );
        // check actualFunc exists, dunno how tho, so just assume it isn't if it's locked
        if (actualFunc.isUnlocked) {
          foundFunction = actualFunc;
        }
      }
      if (foundFunction != null) {
        // look for other args
        let args = [literals[i]];
        let checkingIndex = i;
        while (checkingIndex < literals.length) {
          if (adaptedStr[literalsIndexes[i] + literals[i].length] != ',') {
            break;
          }
          //should be a literal on the other side
          if (!literalsIndexes.contains(literalsIndexes[i] + literals[i].length)) {
            break;
          }
          args.push(literals[i+1]); // literals is ordered and should be kept that way
          checkingIndex++;
        }
      }
    }
  }
}

function parse(str) {
  // ASSUMES FULL BRACKETING
  // ALSO ASSUMES EVERYTHING IS A FUNCTION (very easy if things are suggested/selected from a list client side)
  // ALSO ASSUMES MORE STUFF AND ISN'T FINISHED
  // ALSO GWA
  
  // split into a full arrawy of just functions and their arguments
  const splitStr = str.split(/[()]+/);
  // look for literals (the base case)
  let literals = [];
  let literalsIndexes = [];
  for (let i = 0; i < splitStr.length(); i++) {
    // check if literal and add to list - maybe have it add index as well?
    if (/[0123456789]/.test(splitStr[i])) {
      literals.push(splitStr[i]);
      literalsIndexes.push(i);
    }
  }
  while (splitStr.length() > 1) {
    for (let i = 0; i < literals.length(); i++) {
      let value = literals[i][0];
      let index = literals[i][1];
      let leftFunc = splitStr[index - 1];
      // rightFunc should be either nonexistant or a comma
      //let rightFunc = splitStr[index + 1]; // stop this checking oob
      if (leftFunc == ',') {
        // ignore it
        continue;
      }
      // find number of arguments (work out arbitrary args later, may need to keep brackets in split)
      if (!(leftFunc in Functions) || !Functions[leftFunc].unlocked) {
        // tell them they're a fool
      }
      if (Functions[leftFunc].isBanned || Functions[leftFunc].isStunned) {
        // special stuff
      }
      let expectedArgs = Functions[leftFunc].expectedArgs;
      let args = [];
      let argsIndexes = [];
      for (let j = 0; j < expectedArgs.length(); j++) {
        // has arg been calculated to literal already
        if (splitStr[index + 1] == ',' && literalsIndexes.includes(index + 2)) {
          args.push(literals[index + 2]);
          argsIndexes.push(literalsIndexes.indexOf(index + 2));
        }
      }
      if (args.length == expectedArgs.length()) {
        let result = Functions[leftFunc].evaluate(args);
        // update literals lists
        for (let k = 0; k < expectedArgs.length(); k++) {
          literals[argsIndexes[k]] = 'test'; // to avoid resizing while deleting
          literalsIndexes[argsIndexes[k]] = 'test';
        }
        literals.removeAll('test');
        literalsIndexes.removeAll('test');
        literals.push(result);
        literalsIndexes.push(index - 1);
        // update splitStr
        splitStr[index - 1] = result
          // remove calculated stuff
        for (let j = 0; j < expectedArgs.length() * 2 - 1; j++) {
          splitStr.removeAt(index);
        }
        // reset the literals search
        break;
      }
    }
  }
  return splitStr[0]; // gwa
}