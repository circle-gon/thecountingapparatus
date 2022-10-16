function stringToChunked(str) {
  let parenDepth = 0
  let funcs = ["abu+(a,b)","AT(a,b,c)"]
  let binOps = ["+","-","*","/"]
  let leftUnOps = ["#"]
  let rightUnOps = ["!", "!!"]
  let doubleSidedOps = ["[[a]]","||a||"]
  let chunk = ""
  for(let i in str.split("")) {
    for(let j in binOps) {
      if(str[i] == "(") {
        parenDepth++;continue
      }
      if(str[i] == ")") {
        parenDepth--; continue
      }
      if(str[i])
      if(str.substr(i).startsWith(binOps[j])) {
        
      }
    }
  } // hey wait
}
function chunkToAst(chunk) {
let parenDepth = 0
let binaryOperators = ["+","-","*","^","/"]

}
