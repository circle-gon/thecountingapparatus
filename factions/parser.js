function stringToChunked(str) { //HOPEFULLY this isn't going to be designed hard-code style... Although this does look concise so far
  if(!(/[^123456789]/.test(str))) return ["literal", Number(str)]
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
  let currentFunc = ["func",""]
  for(let i in str.split("")) {
    if(str[i] == "(") {
        if(names.includes(chunk) && parenDepth == 0) {
          currentFunc[1] = chunk
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
          if(currentFunc[1].length > 0 && currentFunc[0] == "func") {
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
      if(str[i] == "," && currentFunc[1].length >= 1 && parenDepth == 1 && currentFunc[0] == "func") {
        args.push(stringToChunked(chunk))
        console.log(chunk)
        chunk = ""
        continue
      }
    chunk += str[i]
    if(chunk.endsWith(currentFunc[1].split("a")[1]) && currentFunc[0] == "wrap") {
      currentFunc[1]
    }
    for(let j in doubleSidedOps) {
      if(chunk.endsWith(doubleSidedOps[j].split("a")[1])) {
        if(parenDepth > 0) {
          chunks.push(chunk.substr(0,doubleSidedOps.split("a")[1].length))
        } else chunks.push(stringToChunked(chunk.substr(0,doubleSidedOps.split("a")[1].length)))
        chunk = ""
      }
      if(chunk.endsWith(doubleSidedOps[j].split("a")[0])) {
        if(parenDepth > 0 && currentFunc[1] != doubleSidedOps[j]) continue
        chunks.push(stringToChunked(chunk.substr(0,doubleSidedOps.split("a")[0].length)))
        chunk = chunk.substr(-1*doubleSidedOps.split("a")[0].length)
      }
      if(doubleSidedOps[j].split("a")[0] == chunk.substr(0,chunk.length-1) && (binOps.map(n => n[0]).includes(chunk[chunk.length-1]) || /[0123456789]/.test(chunk[chunk.length-1]))) {
        parenDepth++
        if(parenDepth > 0) {
          chunk = chunks.pop() + chunk
          continue
        }
        currentFunc[0] = "wrap"
        currentFunc[1] = doubleSidedOps[j]
        chunk = chunk[chunk.length-1]
      }
    } // ok time to see if this piece of shit works for functions
  } // hey wait
  return chunks
}
function chunkToAst(chunk) {
let parenDepth = 0
let binaryOperators = ["+","-","*","^","/"]

}
