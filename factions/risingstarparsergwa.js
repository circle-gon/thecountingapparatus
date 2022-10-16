function parse(str) {
  // ASSUMES FULL BRACKETING
  // ALSO ASSUMES EVERYTHING IS A FUNCTION (very easy if things are suggested/selected from a list client side)
  
  // split into a full arrawy of just functions and their arguments
  const splitStr = str.split('/[()]+/');
  // look for literals (the base case)
  let literals = [];
  for (let i = 0; i < splitStr.length(); i++) {
    // check if literal and add to list - maybe have it add index as well?
    if ('/[0123456789]/'.test(splitStr[i])) {
      literals.push([splitStr[i], i]);
    }
  }
  for (let i = 0; i < literals.length(); i++) {
    let value = literals[i][0];
    let index = literals[i][1];
    let leftFunc = splitStr[index - 1];
    // rightFunc should be either nonexistant or a comma
    let rightFunc = splitStr[index + 1]; // stop this checking oob
  }
}