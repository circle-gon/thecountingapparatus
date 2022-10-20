import {
  FUNCTIONS,
  Right,
  Bin,
  Operator,
  Left
} from "../functions/functionList.js";

import {
  FunctionBase
} from "../functions/functionClass.js";

class ParserError extends Error {}

export function parse2(str) {
  console.log("start parse of " + str);
  // find all the actual numbers and their indexes
  let literals = str.match(/\d+/g); // this doesn't get index gwa
  if (literals === undefined) {
    return false;
  }
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
    replaceString = replaceString.replace(literals[i], Array(literalsLengths[i] + 1).join("a"));
  }
  
  let usedFunctions = [];
  let originalLiterals = literals;
  
  // going through the literals, look for the longest valid function
  // start left, then right/binary, then enclosing
  // if a function has multiple args, wait until all other args are literals - if there's a non literal in the way, wait/something's wrong
  // if something's processed, collapse it and adjust literals/indexes
  // can process a maximum number of times == length of string (hopefully a vast overestimate, but safe)
  // just copying code for each direction atm, there's prolly a better way
  
  // proposed order: right unary, binary (to right), left unary, func, repeat ignoring first brackets
  let adaptedStr = str;
  for (let notUsed = 0; notUsed < str.length; notUsed++) {
    console.log("adaptedStr: " + adaptedStr);
    console.log("literals:");
    console.log(literals);
    console.log("literalsIndexes:");
    console.log(literalsIndexes);
    console.log("literalsLengths:");
    console.log(literalsLengths);
    if (adaptedStr.length === literalsLengths[0]) {
      break;
    }
    // check literals in order, if nothing happens, check next
    for (let i = 0; i < literals.length + 1; i++) {
      if (i === literals.length) {
        // nothing was found
        if (adaptedStr.length !== literalsLengths[0]) {
          throw new ParserError("no operation found but not finished");
        }
      }
      // left existence
      let functionProperties = findFunction(adaptedStr, literalsIndexes[i], literalsLengths[i], "left", true, [[0, "("], [0, "x"]], [FunctionBase]);
      let foundFunction = functionProperties[0];
      let foundLength = functionProperties[1];
      if (foundFunction !== null) {
        console.log(foundFunction);
        // look for other args
        let args = gatherArgs(adaptedStr, i, literals, literalsLengths, literalsIndexes, foundFunction, foundLength);
        console.log("args:");
        console.log(args);
        if (args !== null) {
          // check extra args don't have a unary operator to go through first
          let testForUnary = [null];
          for (let l = 1; l < args.length; l++) {
            testForUnary = findFunction(adaptedStr, literalsIndexes[i + l], literalsLengths[i + l], "right", false, [["x", null]], [Right]);
            if (testForUnary[0] !== null) {
              break;
            }
          }
          if (testForUnary[0] !== null) {
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
          const lastLength = adaptedStr.length;
          adaptedStr = adaptedStr.substr(0,literalsIndexes[i]) + ";" + adaptedStr.substr(literalsIndexes[i] + foundLength + removedLength + functionProperties[2]/* till end*/); // removes right brackets, must be balanced
          // let bracketsBeGone = 0;
          // while (adaptedStr[literalsIndexes[i] + 1] === ")") {
          //   adaptedStr = adaptedStr.substr(0,literalsIndexes[i] + 1) + adaptedStr.substr(literalsIndexes[i] + 2);
          //   bracketsBeGone++;
          // }
          // actually remove used literals
          literals = literals.filter((x) => x !== "remove");
          literalsIndexes = literalsIndexes.filter((x) => x !== "remove");
          literalsLengths = literalsLengths.filter((x) => x !== "remove");
          // offset later remaining literals
          for (let k = i + 1; k < literals.length; k++) {
            literalsIndexes[k] -= lastLength - adaptedStr.length;
          }
          usedFunctions.push(foundFunction);
          break; // reset loop and avoid getting kicked out for reaching the end
        }
      }
      
      // right existence
      functionProperties = findFunction(adaptedStr, literalsIndexes[i], literalsLengths[i], "right", true, [["x", null], ["x", "y"]], [Bin, Right]);
      foundFunction = functionProperties[0];
      foundLength = functionProperties[1];
      
      if (foundFunction !== null) {
        console.log(foundFunction);
        // look for other args
        // const expectedArgs = foundFunction.syntax.split(",");
        let args = gatherArgs(adaptedStr, i, literals, literalsLengths, literalsIndexes, foundFunction, foundLength);
        console.log("args:");
        console.log(args);
        if (args !== null) {
          // check extra args don't have a unary operator to go through first
          let testForUnary = [null];
          for (let l = 1; l < args.length; l++) {
            testForUnary = findFunction(adaptedStr, literalsIndexes[i + l], literalsLengths[i + l], "right", false, [["x", null]], [Right]);
            if (testForUnary[0] !== null) {
              break;
            }
          }
          if (testForUnary[0] !== null) {
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
          while (adaptedStr[literalsIndexes[i] - 1] === "(") {
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
          usedFunctions.push(foundFunction);
          break; // reset loop and avoid getting kicked out for reaching the end
        }
      }
      // enclosing existance trol
      
    }
  }
  console.log([literals[0], usedFunctions, originalLiterals]);
  return [literals[0], usedFunctions, originalLiterals];
}

function gatherArgs(str, i, literals, lengths, indexes, func, foundLength) {
  let expectedArgs = func.syntax.split(",").length; // usually 1
  let args = [literals[i]];
  if (expectedArgs > 1) { // multi arg function
    let checkingIndex = i;
    while (checkingIndex < literals.length) {
      if (str[indexes[checkingIndex] + lengths[checkingIndex]] !== ',') {
        break;
      }
      //should be a literal on the other side
      if (checkingIndex >= literals.length || indexes[checkingIndex + 1] !== indexes[checkingIndex] + lengths[checkingIndex] + 1) {
        break;
      }
      args.push(literals[i+1]); // literals is ordered and should be kept that way
      checkingIndex++;
    }
  }
  if (func instanceof Bin) {
    expectedArgs = 2;
    if (i + 1 < literals.length && indexes[i + 1] === indexes[i] + lengths[i] + foundLength) {
      args.push(literals[i + 1]);
    }
  }
  return args.length === expectedArgs ? args : null;
}

function findFunction(str, startIndex, startLength, direction, ignoreBrackets, delimiterArgs, operatorType) {
  let foundFunction = null;
  let foundLength = 0;
  let bracketsSkipped = 0;
  let maxDistance = startIndex;
  if (direction === "right") {
    maxDistance = str.length - startIndex;
  }
  
  for (let distance = 1; distance <= maxDistance; distance++) {
    // find if there's a function with fitting syntax
    // ignore brackets if no function has been found yet
    let subString = null;
    if (direction === "left") {
      subString = str.substring(startIndex - distance, startIndex);
    }
    else if (direction === "right") {
      subString = str.substring(startIndex + startLength, startIndex + startLength + distance);
    }
    if (foundFunction === null && ignoreBrackets) {
      subString = subString.replace(/[()]/g, '');
      bracketsSkipped = distance - subString.length;
    }
    const actualFunc = Object.values(FUNCTIONS).find( function (i) {
      // possibly split up operators to prioritize
      let validOperator = false;
      for (const operator of operatorType) {
        if (i instanceof operator) {
          validOperator = true;
          break;
        }
      }
      if (!validOperator) {
        return false;
      }
      let comparisonStrings = [i.syntax];
      for (const delimiters of delimiterArgs) {
        let syntaxSub =  null;
        if (delimiters[1] !== null) {
          syntaxSub = i.syntax.substring((typeof delimiters[0] === 'string') ? i.syntax.indexOf(delimiters[0]) + 1 : delimiters[0], (typeof delimiters[1] === 'string') ? i.syntax.indexOf(delimiters[1]) : delimiters[1]);
        }
        else {
          syntaxSub = i.syntax.substring((typeof delimiters[0] === 'string') ? i.syntax.indexOf(delimiters[0]) + 1 : delimiters[0]);
        }
        if (syntaxSub !== '') {
          comparisonStrings.push(syntaxSub);
        }
      }
      for (const string of comparisonStrings) {
        if (string === subString) {
          return true;
        }
      }
      return false;
    }
    );
    // check actualFunc exists, dunno how tho, so just assume it isn't if it's locked
    if (actualFunc !== undefined && actualFunc.isUnlocked) {
      foundFunction = actualFunc;
      foundLength = distance;
    }
  }
  return [foundFunction, foundLength, bracketsSkipped];
}

// function parse(str) {
//   // ASSUMES FULL BRACKETING
//   // ALSO ASSUMES EVERYTHING IS A FUNCTION (very easy if things are suggested/selected from a list client side)
//   // ALSO ASSUMES MORE STUFF AND ISN'T FINISHED
//   // ALSO GWA
  
//   // split into a full arrawy of just functions and their arguments
//   const splitStr = str.split(/[()]+/);
//   // look for literals (the base case)
//   let literals = [];
//   let literalsIndexes = [];
//   for (let i = 0; i < splitStr.length(); i++) {
//     // check if literal and add to list - maybe have it add index as well?
//     if (/[0123456789]/.test(splitStr[i])) {
//       literals.push(splitStr[i]);
//       literalsIndexes.push(i);
//     }
//   }
//   while (splitStr.length() > 1) {
//     for (let i = 0; i < literals.length(); i++) {
//       let value = literals[i][0];
//       let index = literals[i][1];
//       let leftFunc = splitStr[index - 1];
//       // rightFunc should be either nonexistant or a comma
//       //let rightFunc = splitStr[index + 1]; // stop this checking oob
//       if (leftFunc == ',') {
//         // ignore it
//         continue;
//       }
//       // find number of arguments (work out arbitrary args later, may need to keep brackets in split)
//       if (!(leftFunc in Functions) || !Functions[leftFunc].unlocked) {
//         // tell them they're a fool
//       }
//       if (Functions[leftFunc].isBanned || Functions[leftFunc].isStunned) {
//         // special stuff
//       }
//       let expectedArgs = Functions[leftFunc].expectedArgs;
//       let args = [];
//       let argsIndexes = [];
//       for (let j = 0; j < expectedArgs.length(); j++) {
//         // has arg been calculated to literal already
//         if (splitStr[index + 1] == ',' && literalsIndexes.includes(index + 2)) {
//           args.push(literals[index + 2]);
//           argsIndexes.push(literalsIndexes.indexOf(index + 2));
//         }
//       }
//       if (args.length == expectedArgs.length()) {
//         let result = Functions[leftFunc].evaluate(args);
//         // update literals lists
//         for (let k = 0; k < expectedArgs.length(); k++) {
//           literals[argsIndexes[k]] = 'test'; // to avoid resizing while deleting
//           literalsIndexes[argsIndexes[k]] = 'test';
//         }
//         literals.removeAll('test');
//         literalsIndexes.removeAll('test');
//         literals.push(result);
//         literalsIndexes.push(index - 1);
//         // update splitStr
//         splitStr[index - 1] = result
//           // remove calculated stuff
//         for (let j = 0; j < expectedArgs.length() * 2 - 1; j++) {
//           splitStr.removeAt(index);
//         }
//         // reset the literals search
//         break;
//       }
//     }
//   }
//   return splitStr[0]; // gwa
// }