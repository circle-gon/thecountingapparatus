import {
  FUNCTIONS,
  Right,
  Bin,
  Operator,
  Left
} from "../functions/functionList.js";

export function parse2(str) {
  console.log("start parse of " + str);
  // find all the actual numbers and their indexes
  let literals = str.match(/\d+/g); // this doesn't get index gwa
  let literalsIndexes = [];
  let literalsLengths = [];
  let replaceString = str;
  for (let i = 0; i < literals.length; i++) {
    //get first index, literals is ordered
    let index = replaceString.indexOf(literals[i]);
    literalsIndexes.push(index);
    literalsLengths.push(literals[i].length);
    literals[i] = Number(literals[i]);
    // replace the index with a not number of same length
    replaceString = replaceString.replace(literals[i], new Array(literalsLengths[i] + 1).join("a"));
  }
  
  // going through the literals, look for the longest valid function
  // start left, then right, then binary, then enclosing
  // if a function has multiple args, wait until all other args are literals - if there's a non literal in the way, wait/something's wrong
  // if something's processed, collapse it and adjust literals/indexes
  // can process a maximum number of times == length of string (hopefully a vast overestimate, but safe)
  // just copying code for each direction atm, there's prolly a better way
  let adaptedStr = str;
  for (let notUsed = 0; notUsed < str.length; notUsed++) {
    console.log("adaptedStr: " + adaptedStr);
    console.log("literals:");
    console.log(literals);
    console.log("literalsIndexes:");
    console.log(literalsIndexes);
    console.log("literalsLengths:");
    console.log(literalsLengths);
    if (adaptedStr.length == 1) {
      break;
    }
    // check literals in order, if nothing happens, check next
    for (let i = 0; i < literals.length; i++) {
      // left existence
      let foundFunction = null;
      let foundLength = 0;
      for (let distanceLeft = 1; distanceLeft <= literalsIndexes[i]; distanceLeft++) {
        // find if there's a function with fitting syntax
        // ignore brackets if no function has been found yet
        let subString = adaptedStr.substring(literalsIndexes[i] - distanceLeft, literalsIndexes[i]);
        if (foundFunction == null) {
          subString = subString.replace(/[()]/g, '');
        }
        const actualFunc = Object.values(FUNCTIONS).find( function (i) {
          // possibly split up operators to prioritize
          const syntaxSub = i.syntax.substring(0, i.syntax.indexOf("("));
          if (syntaxSub == '') {
            return false;
          }
          return i.syntax === subString || syntaxSub === subString;
        }
        );
        // check actualFunc exists, dunno how tho, so just assume it isn't if it's locked
        if (actualFunc != undefined && actualFunc.isUnlocked) {
          foundFunction = actualFunc;
          foundLength = distanceLeft;
        }
      }
      if (foundFunction != null) {
        console.log(foundFunction);
        // look for other args
        const expectedArgs = foundFunction.syntax.split(",");
        let args = [literals[i]];
        let checkingIndex = i;
        if (!(foundFunction instanceof Left)) {
          while (checkingIndex < literals.length) {
            if (adaptedStr[literalsIndexes[checkingIndex] + literalsLengths[checkingIndex]] != ',') {
              break;
            }
            //should be a literal on the other side
            if (checkingIndex >= literals.length || literalsIndexes[checkingIndex + 1] != literalsIndexes[checkingIndex] + literalsLengths[checkingIndex] + 1) {
              break;
            }
            args.push(literals[i+1]); // literals is ordered and should be kept that way
            checkingIndex++;
          }
        }
        console.log("args:");
        console.log(args);
        if (args.length == expectedArgs.length) {
          // check extra args don't have a unary operator to go through first
          let foundFunction2 = null;
          for (let l = 1; l < args.length; l++) {
            //specifically right unary is the only problem
            // shh yes this is bad code
            for (let distanceRight = 1; distanceRight <= adaptedStr.length - literalsIndexes[i + l]; distanceRight++) {
              // find if there's a function with fitting syntax
              // DONT ignore brackets if no function has been found yet
              let subString = adaptedStr.substring(literalsIndexes[i + l] + literalsLengths[i + l], literalsIndexes[i + l] + literalsLengths[i + l] + distanceRight);
              const actualFunc = Object.values(FUNCTIONS).find( function (f) {
                // possibly split up operators to prioritize
                const syntaxSub = f.syntax.substring(f.syntax.indexOf("x") + 1);
                if (syntaxSub == '' || !(f instanceof Right)) {
                  return false;
                }
                return f.syntax === subString || syntaxSub === subString;
              }
              );
              // check actualFunc exists, dunno how tho, so just assume it isn't if it's locked
              if (actualFunc != undefined && actualFunc.isUnlocked) {
                foundFunction2 = actualFunc;
                console.log("arg has right unary");
                break;
              }
            }
            if (foundFunction2 != null) {
              break;
            }
          }
          if (foundFunction2 != null) {
            // arg has a right unary, so wait
            continue;
          }
          const result = foundFunction.evaluate(args);
          let removedLength = literalsLengths[i];
          literals[i] = result
          literalsLengths[i] = 1;
          // remove extra used literals
          for (let k = 1; k < args.length; k++) {
            removedLength += literalsLengths[i + k] + 1;
            literals[i + k] = "remove";
            literalsIndexes[i + k] = "remove";
            literalsLengths[i + k] = "remove";
          }
          // collapse (remove right sided brackets as well) // equal to number of left brackets?
          literalsIndexes[i] -= foundLength;
          adaptedStr = adaptedStr.substr(0,literalsIndexes[i]) + ";" + adaptedStr.substr(literalsIndexes[i] + foundLength + removedLength/* till end*/);
          let bracketsBeGone = 0;
          while (adaptedStr[literalsIndexes[i] + 1] == ")") {
            adaptedStr = adaptedStr.substr(0,literalsIndexes[i] + 1) + adaptedStr.substr(literalsIndexes[i] + 2);
            bracketsBeGone++;
          }
          // actually remove used literals
          literals = literals.filter((x) => x !== "remove");
          literalsIndexes = literalsIndexes.filter((x) => x !== "remove");
          literalsLengths = literalsLengths.filter((x) => x !== "remove");
          // offset later remaining literals
          for (let k = i + 1; k < literals.length; k++) {
            literalsIndexes[k] -= foundLength + removedLength + bracketsBeGone;
          }
        }
      }
      
      // right existence
      foundFunction = null;
      foundLength = 0;
      for (let distanceRight = 1; distanceRight <= adaptedStr.length - literalsIndexes[i]; distanceRight++) {
        // find if there's a function with fitting syntax
        // ignore brackets if no function has been found yet
        let subString = adaptedStr.substring(literalsIndexes[i] + literalsLengths[i], literalsIndexes[i] + literalsLengths[i] + distanceRight);
        if (foundFunction == null) {
          subString = subString.replace(/[()]/g, '');
        }
        const actualFunc = Object.values(FUNCTIONS).find( function (i) {
          // possibly split up operators to prioritize
          const syntaxSub = i.syntax.substring(i.syntax.indexOf("x") + 1);
          if (syntaxSub == '') {
            return false;
          }
          return i.syntax === subString || syntaxSub === subString;
        }
        );
        // check actualFunc exists, dunno how tho, so just assume it isn't if it's locked
        if (actualFunc != undefined && actualFunc.isUnlocked) {
          foundFunction = actualFunc;
          foundLength = distanceRight;
        }
      }
      if (foundFunction != null) {
        console.log(foundFunction);
        // look for other args
        // const expectedArgs = foundFunction.syntax.split(",");
        let args = [literals[i]];
        if (foundFunction instanceof Bin) {
          if (i + 1 < literals.length && literalsIndexes[i + 1] == literalsIndexes[i] + literalsLengths[i] + foundLength) {
            args.push(literals[i + 1]);
          }
        }
        console.log("args:");
        console.log(args);
        if (args.length == (foundFunction instanceof Bin ? 2 : 1)) {
          // check extra args don't have a unary operator to go through first
          let foundFunction2 = null;
          for (let l = 1; l < args.length; l++) {
            //specifically right unary is the only problem
            // shh yes this is bad code
            for (let distanceRight = 1; distanceRight <= adaptedStr.length - literalsIndexes[i + l]; distanceRight++) {
              // find if there's a function with fitting syntax
              // DONT ignore brackets if no function has been found yet
              let subString = adaptedStr.substring(literalsIndexes[i + l] + literalsLengths[i + l], literalsIndexes[i + l] + literalsLengths[i + l] + distanceRight);
              const actualFunc = Object.values(FUNCTIONS).find( function (f) {
                // possibly split up operators to prioritize
                const syntaxSub = f.syntax.substring(f.syntax.indexOf("x") + 1);
                if (syntaxSub == '' || !(f instanceof Right)) {
                  return false;
                }
                return f.syntax === subString || syntaxSub === subString;
              }
              );
              // check actualFunc exists, dunno how tho, so just assume it isn't if it's locked
              if (actualFunc != undefined && actualFunc.isUnlocked) {
                foundFunction2 = actualFunc;
                console.log("arg has right unary");
                break;
              }
            }
            if (foundFunction2 != null) {
              break;
            }
          }
          if (foundFunction2 != null) {
            // arg has a right unary, so wait
            continue;
          }
          const result = foundFunction.evaluate(args);
          console.log("result:");
          console.log(result);
          let removedLength = literalsLengths[i];
          literals[i] = result
          literalsLengths[i] = 1;
          // remove extra used literals
          for (let k = 1; k < args.length; k++) {
            removedLength += literalsLengths[i + k];
            literals[i + k] = "remove";
            literalsIndexes[i + k] = "remove";
            literalsLengths[i + k] = "remove";
          }
          // collapse (remove left sided brackets as well) // equal to number of right brackets?
          // literalsIndexes[i] -= foundLength;
          adaptedStr = adaptedStr.substr(0,literalsIndexes[i]) + ";" + adaptedStr.substr(literalsIndexes[i] + foundLength + removedLength/* till end, dunno about the -1*/);
          let bracketsBeGone = 0;
          while (adaptedStr[literalsIndexes[i] - 1] == "(") {
            adaptedStr = adaptedStr.substr(0,literalsIndexes[i] - 1) + adaptedStr.substr(literalsIndexes[i]);
            bracketsBeGone++;
          }
          literalsIndexes[i] -= bracketsBeGone;
          // actually remove used literals
          literals = literals.filter((x) => x !== "remove");
          literalsIndexes = literalsIndexes.filter((x) => x !== "remove");
          literalsLengths = literalsLengths.filter((x) => x !== "remove");
          // offset later remaining literals
          for (let k = i + 1; k < literals.length; k++) {
            literalsIndexes[k] -= foundLength + removedLength + bracketsBeGone - 1;
          }
        }
      }
      // enclosing existance trol
      
    }
  }
  console.log(literals[0]);
  return literals[0];
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