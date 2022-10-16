import {
  Functions,
  // Operators,
  // Left,
  // Right,
  // Wrap,
  // Bin,
} from "../functions/functionClass.js";

function parse(str) {
  // ASSUMES FULL BRACKETING
  // ALSO ASSUMES EVERYTHING IS A FUNCTION (very easy if things are suggested/selected from a list client side)
  
  // split into a full arrawy of just functions and their arguments
  const splitStr = str.split('/[()]+/');
  // look for literals (the base case)
  let literals = [];
  let literalsIndexes = [];
  for (let i = 0; i < splitStr.length(); i++) {
    // check if literal and add to list - maybe have it add index as well?
    if ('/[0123456789]/'.test(splitStr[i])) {
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
      let rightFunc = splitStr[index + 1]; // stop this checking oob
      if (leftFunc == ',') {
        // ignore it
        continue;
      }
      // find number of arguments (work out arbitrary args later, may need to keep brackets in split)
      let expectedArgs = Functions[leftFunc].expectedArgs; // check function exists?
      let args = [];
      let argsIndexes = [];
      for (let j = 0; j < expectedArgs.length(); j++) {
        // has arg been calculated to literal already
        if (splitStr[index + 1] == ',' && literalsIndexes.includes(index + 2)) {
          args.push(literals[index + 2]);
          argsIndexes.push(literalsIndexes.indexOf(index + 2));
        }
      }
      if (args.length == expectedArgs) {
        let result = Functions[leftFunc].evaluate(args);
        // update literals lists
        for (let k = 0; k < expectedArgs; k++) {
          literals[argsIndexes[k]] = 'test'; // to avoid resizing while deleting
          literalsIndexes[argsIndexes[k]] = 'test';
        }
        literals.removeAll('test');
        literalsIndexes.removeAll('test');
        literals.push(result);
        literalsIndexes.push(index - 1);
        // update splitStr
        
        // reset the literals search
        break;
      }
    }
  }
}