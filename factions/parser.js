function stringToChunked(str) { //HOPEFULLY this isn't going to be designed hard-code style... Although this does look concise so far
  let parenDepth = 0
  let funcs = ["abu+(a,b)","AT(a,b,c)"]
  let names = funcs.map(n => n.split("(")[0])
  let binOps = ["+","-","*","/"]
  let leftUnOps = ["#"]
  let rightUnOps = ["!", "!!"]
  let doubleSidedOps = ["[[a]]","||a||"]
  let chunk = ""
  let chunks = []
  let args = []
  let currentFunc = ""
  for(let i in str.split("")) {
    for(let j in binOps) {
      if(str[i] == "(") {
        if(names.includes(chunk)) {
          currentFunc = chunk
          parenDepth++
          chunk = ""
          continue
        } // i'm going to wake up tomorrow not understanding what this does :trol:
        if(parenDepth == 0) {
          parenDepth++;chunks.push(["literal",chunk]);chunk="";continue
        }
      }
      if(str[i] == ")") {
        parenDepth--; 
        if(parenDepth == 0) {
          if(currentFunc.length > 0) {
            args.push(stringToChunked(chunk))
            chunk = ""
            chunks.push(["function",currentFunc,args])
            args = []
            currentFunc = ""
          } else {
            chunks.push([stringToChunked(chunk)])
          }
        }
        continue
      }
      if(str[i] == "," && parenDepth == 1) {
        
      }
      if(str.substr(i).startsWith(binOps[j])) {
        
      }
    }
  } // hey wait
}
function chunkToAst(chunk) {
let parenDepth = 0
let binaryOperators = ["+","-","*","^","/"]

}
