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
    if(str[i] == "(") {
        if(names.includes(chunk) && parenDepth == 0) {
          currentFunc = chunk
          parenDepth++
          chunk = ""
          continue
        } // i'm going to wake up tomorrow not understanding what this does :trol:
        if(parenDepth == 0) {
          parenDepth++;chunks.push(["literal",chunk]);chunk="";continue
        }
        parenDepth++
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
            chunks.push(["parens",stringToChunked(chunk)])
            chunk = ""
          }
          continue
        }
      }
      if(str[i] == "," && currentFunc.length >= 1 && parenDepth == 1) {
        args.push(stringToChunked(chunk))
        console.log(chunk)
        chunk = ""
        continue
      }
    chunk += str[i]
    for(let j in binOps) {
      
      
    } // ok time to see if this piece of shit works for functions
  } // hey wait
  return chunks
}
function chunkToAst(chunk) {
let parenDepth = 0
let binaryOperators = ["+","-","*","^","/"]

}
