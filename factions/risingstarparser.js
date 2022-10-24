import {
  FUNCTIONS,
  Func,
  Right,
  Left,
  Wrap,
  Bin,
  Subscript
} from "../functions/functionList.js";

class ParserError extends Error {}

export function parse2(str, additionalLiteral = ["", 0]) {
  str = str.replaceAll(" ", "");
  console.log("start parse of " + str);
  // find all the actual numbers and their indexes
  let re = new RegExp("[\\d" + additionalLiteral[0] + "]+", "g");
  console.log(re);
  let literals = str.match(re); // this doesn't get index gwa
  console.log(literals);
  if (literals === undefined || literals.length == 0) {
    throw new ParserError("no inputs found");
    return false;
  }
  let originalLiterals = literals.slice();
  let literalsIndexes = [];
  let literalsLengths = [];
  let replaceString = str;
  for (let i = 0; i < literals.length; i++) {
    //get first index, literals is ordered
    let index = replaceString.indexOf(literals[i]);
    literalsIndexes.push(index);
    literalsLengths.push(literals[i].length);
    if (literals[i] == additionalLiteral[0]) {
      literals[i] = additionalLiteral[1];
    } else {
      literals[i] = Number(literals[i]);
    }
    // replace the index with a not number of same length
    replaceString = replaceString.replace(
      literals[i],
      Array(literalsLengths[i] + 1).join("a")
    );
  }

  let usedFunctions = [];

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
    for (let r = 0; r < 2 * literals.length + 1; r++) {
      if (r === literals.length * 2) {
        // nothing was found
        if (adaptedStr.length !== literalsLengths[0]) {
          throw new ParserError("no operation found but not finished");
        }
      }
      let i = r % literals.length;

      let functionPropertiesList = [];
      let ignoreBrackets = r >= literals.length;
      // respecting brackets
      // right unary
      functionPropertiesList.push(
        findFunction(
          adaptedStr,
          literalsIndexes[i],
          literalsLengths[i],
          "right",
          ignoreBrackets,
          [["x", null]],
          [Right]
        )
      );
      // (right) binary
      functionPropertiesList.push(
        findFunction(
          adaptedStr,
          literalsIndexes[i],
          literalsLengths[i],
          "right",
          ignoreBrackets,
          [["x", "y"]],
          [Bin]
        )
      );
      // left unary
      functionPropertiesList.push(
        findFunction(
          adaptedStr,
          literalsIndexes[i],
          literalsLengths[i],
          "left",
          ignoreBrackets,
          [[0, "x"]],
          [Left]
        )
      );
      // enclosing
      functionPropertiesList.push(
        findFunction(
          adaptedStr,
          literalsIndexes[i],
          literalsLengths[i],
          "both",
          ignoreBrackets,
          [
            [0, "x"],
            ["x", null],
          ],
          [Wrap]
        )
      );
      // function
      functionPropertiesList.push(
        findFunction(
          adaptedStr,
          literalsIndexes[i],
          literalsLengths[i],
          "left",
          ignoreBrackets,
          [[0, "("], [0, "["]],
          [Func, Subscript]
        )
      );

      let functionProperties = null;
      let breakLiteralLoop = false;
      for (let j = 0; j < functionPropertiesList.length; j++) {
        if (functionPropertiesList[j] != null) {
          functionProperties = functionPropertiesList[j];
          //     break;
          //   }
          // }
          if (functionProperties != null) {
            let foundFunction = functionProperties[0];
            let foundLength = functionProperties[1];
            let bracketsRemoved = functionProperties[2];
            let direction = functionProperties[3];
            console.log(foundFunction);

            let args = gatherArgs(
              adaptedStr,
              i,
              literals,
              literalsLengths,
              literalsIndexes,
              foundFunction,
              foundLength
            );
            console.log("args:");
            console.log(args);

            if (args !== null) {
              // check extra args don't have a unary operator to go through first
              let testForUnary = null;
              for (let l = 1; l < args.length; l++) {
                testForUnary = findFunction(
                  adaptedStr,
                  literalsIndexes[i + l],
                  literalsLengths[i + l],
                  "right",
                  false,
                  [["x", null]],
                  [Right]
                );
                if (testForUnary !== null) {
                  break;
                }
              }
              if (testForUnary !== null) {
                // arg has a right unary, so wait
                console.log("arg has right unary");
                continue;
              }

              const result = foundFunction.evaluate(args);
              console.log("result:");
              console.log(result);

              // let removedLength = literalsLengths[i];
              let removedLength =
                literalsIndexes[i + args.length - 1] -
                literalsIndexes[i] +
                literalsLengths[i + args.length - 1];
              literals[i] = result;
              literalsLengths[i] = 1;
              // remove extra used literals
              for (let k = 1; k < args.length; k++) {
                // removedLength += literalsLengths[i + k];
                literals[i + k] = "remove";
                literalsIndexes[i + k] = "remove";
                literalsLengths[i + k] = "remove";
              }
              const lastLength = adaptedStr.length;
              if (direction == "left") {
                literalsIndexes[i] -= foundLength;
                adaptedStr =
                  adaptedStr.substr(0, literalsIndexes[i]) +
                  ";" +
                  adaptedStr.substr(
                    literalsIndexes[i] +
                      foundLength +
                      removedLength +
                      bracketsRemoved /* till end*/
                  ); // removes right brackets, must be balanced
              } else if (direction == "right") {
                literalsIndexes[i] -= bracketsRemoved;
                if (foundFunction instanceof Bin) {
                  foundLength = 0;
                }
                adaptedStr =
                  adaptedStr.substr(0, literalsIndexes[i]) +
                  ";" +
                  adaptedStr.substr(
                    literalsIndexes[i] +
                      foundLength +
                      removedLength /* till end*/
                  ); // removes left brackets, must be balanced
              } else if (direction === "both") {
                literalsIndexes[i] -= foundLength;
                foundLength = 2 * foundLength;
                adaptedStr =
                  adaptedStr.substr(0, literalsIndexes[i]) +
                  ";" +
                  adaptedStr.substr(
                    literalsIndexes[i] + foundLength + removedLength
                  );
              }
              literals = literals.filter((x) => x !== "remove");
              literalsIndexes = literalsIndexes.filter((x) => x !== "remove");
              literalsLengths = literalsLengths.filter((x) => x !== "remove");

              // remove brackets around singular literals (so they can be found during arg search)
              // yes bad i know gwa
              while (
                adaptedStr[literalsIndexes[i] - 1] == "(" &&
                adaptedStr[literalsIndexes[i] + 1] == ")"
              ) {
                adaptedStr =
                  adaptedStr.substring(0, literalsIndexes[i] - 1) +
                  ";" +
                  adaptedStr.substring(literalsIndexes[i] + 2);
                literalsIndexes[i] -= 1;
              }

              // offset later remaining literals
              for (let k = i + 1; k < literals.length; k++) {
                literalsIndexes[k] -= lastLength - adaptedStr.length;
              }
              usedFunctions.push(foundFunction);
              breakLiteralLoop = true;
              break; // reset loop and avoid getting kicked out for reaching the end
            }
          }
        }
      }
      if (breakLiteralLoop) {
        break;
      }
    }
  }
  console.log([literals[0], usedFunctions, originalLiterals]);
  return [literals[0], usedFunctions, originalLiterals];
}

function gatherArgs(str, i, literals, lengths, indexes, func, foundLength) {
  let expectedArgs = func.syntax.split(",").length; // usually 1
  let args = [literals[i]];
  if (expectedArgs > 1) {
    // multi arg function
    let checkingIndex = i;
    while (checkingIndex < literals.length) {
      if (str[indexes[checkingIndex] + lengths[checkingIndex]] !== ",") {
        break;
      }
      //should be a literal on the other side
      if (
        checkingIndex >= literals.length ||
        indexes[checkingIndex + 1] !==
          indexes[checkingIndex] + lengths[checkingIndex] + 1
      ) {
        break;
      }
      args.push(literals[i + 1]); // literals is ordered and should be kept that way
      checkingIndex++;
    }
  }
  if (func instanceof Bin) {
    expectedArgs = 2;
    if (
      i + 1 < literals.length &&
      indexes[i + 1] === indexes[i] + lengths[i] + foundLength
    ) {
      args.push(literals[i + 1]);
    }
  }
  return args.length === expectedArgs ? args : null;
}

function findFunction(
  str,
  startIndex,
  startLength,
  direction,
  ignoreBrackets,
  delimiterArgs,
  operatorType
) {
  if (direction === "both") {
    let left = findFunction(
      str,
      startIndex,
      startLength,
      "left",
      ignoreBrackets,
      [delimiterArgs[0]],
      operatorType
    );
    let right = findFunction(
      str,
      startIndex,
      startLength,
      "right",
      ignoreBrackets,
      [delimiterArgs[1]],
      operatorType
    );
    if (left != null && right != null) {
      if (left[0] == right[0] && left[2] == right[2]) {
        // same function, num brackets skipped
        return [left[0], left[1], left[2], "both"];
      }
    }
    return null;
  }

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
    } else if (direction === "right") {
      subString = str.substring(
        startIndex + startLength,
        startIndex + startLength + distance
      );
    }
    if (foundFunction === null && ignoreBrackets) {
      subString = subString.replace(/[()]/g, "");
      bracketsSkipped = distance - subString.length;
    }
    const actualFunc = Object.values(FUNCTIONS).find(function (i) {
      // possibly split up operators to prioritize
      for (const operator of operatorType) {
        if (i instanceof operator) {
          return false;
        }
      }
      let comparisonStrings = [i.syntax];
      for (const delimiters of delimiterArgs) {
        let syntaxSub = null;
        if (delimiters[1] !== null) {
          syntaxSub = i.syntax.substring(
            typeof delimiters[0] === "string"
              ? i.syntax.indexOf(delimiters[0]) + 1
              : delimiters[0],
            typeof delimiters[1] === "string"
              ? i.syntax.indexOf(delimiters[1])
              : delimiters[1]
          );
        } else {
          syntaxSub = i.syntax.substring(
            typeof delimiters[0] === "string"
              ? i.syntax.indexOf(delimiters[0]) + 1
              : delimiters[0]
          );
        }
        if (syntaxSub !== "") {
          comparisonStrings.push(syntaxSub);
        }
      }
      for (const string of comparisonStrings) {
        if (string === subString) {
          return true;
        }
      }
      return false;
    });
    // check actualFunc exists, dunno how tho, so just assume it isn't if it's locked
    if (actualFunc !== undefined && actualFunc.isUnlocked) {
      foundFunction = actualFunc;
      foundLength = distance;
    }
  }
  return foundFunction == null
    ? null
    : [foundFunction, foundLength, bracketsSkipped, direction];
}
