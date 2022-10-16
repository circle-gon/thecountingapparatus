function parse(str) {
  // ASSUMES FULL BRACKETING
  
  // split into a full arrawy of just functions and their arguments
  const splitStr = str.split('/[()]+/');
  // look for literals (the base case)
  let literals = [];
  for (let i = 0; i < splitStr.length(); i++) {
    // check if literal and add to list - maybe have it add index as well?
    if ('/[0123456789]/'.test(splitStr[i])) {
      literals.push(splitStr[i]);
    }
  }
}