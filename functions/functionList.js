import { FunctionBase } from "./functionClass.js";
import { gamma } from "../factions/factorial.js";

//Subclasses
class NChooseR extends FunctionBase {
  constructor(name, unlock, syntax, input1, input2) {
    super(
      name,
      unlock,
      syntax,
      (input1, input2) =>
        gamma(input1 + 1) / (gamma(input2 + 1) * gamma(input1 - input2 + 1))
    ); //n!/ (r! (n−r)!)
  }
}

class Logarithm extends FunctionBase {
  constructor(name, unlock, syntax, base) {
    super(name, unlock, syntax, (input) => Math.log(input) / Math.log(base));
  }
}
class SingleNumSeq extends FunctionBase {
  constructor(name, unlock, syntax, num) {
    super(name, unlock, syntax, (input) => num);
  }
}
//Functions (organize by Order of Operations)
const FUNCTIONS = {
  A: new FunctionBase("Ackermann Function", "A", "A(a,b)", function A(a, b) {
    switch (a) {
      case 0:
        return b + 1;
      case 1:
        return b + 2;
      case 2:
        return 2 * b + 3;
      case 3:
        return 2 ** (b + 3) - 3;
      case 4:
        if (b === 0) {
          return 13;
        } else if (b === 1) {
          return 65533;
        } else {
          return Infinity;
        }
      case 5:
        if (b === 0) {
          return 65533;
        } else {
          return Infinity;
        }
      default:
        return Infinity;
    }
  }),
  B: new FunctionBase("Beta Function", "B", "B(x,y)", (x,y) => gamma(x)*gamma(y)/gamma(x+y)),
  C: new FunctionBase("Catalan Numbers", "C", "C(x)", (x) => gamma(2*x)/gamma(x+1)/gamma(x)),
  H: new FunctionBase("Harmonic Numbers", "H", "H(a,b)", function H(a,b){
    var output = 0;
    for(var i=1;i<=a;i++){
      output += 1/(i**b);
    }
    return output;
  }),
  L: new FunctionBase("Lucas Numbers", "L", "L(x)", (x) => ((1+Math.sqrt(5))/2)**x+((1+Math.sqrt(5))/2)**x)
  SIN: new FunctionBase("Sine", "SIN", "sin(x)", Math.sin),
  T: new FunctionBase("Triangular Numbers", "TN", "T(x)", (x) => x--, 2),
  LN: new Logarithm("Natural Log", "LN", "ln(x)", Math.E),
  LOG10: new Logarithm("Logarithm", "LOG", "log10(x)", 10),
  LOG2: new Logarithm("Binary Logarithm", "BL", "log2(x)", 2),
  CHOOSE: new NChooseR("nCr", "CHOOSE", "xCy"),
  ZERO: new SingleNumSeq("All Zeros Sequence", "ZERO", "zero(x)", 0),
  ONE: new SingleNumSeq("All Ones Sequence", "ONE", "one(x)", 1),
  TWO: new SingleNumSeq("All Twos Sequence", "TWO", "two(x)", 2),
  THREE: new SingleNumSeq("All Threes Sequence", "THREE", "three(x)", 3),
  FOUR: new SingleNumSeq("All Fours Sequence", "FOUR", "four(x)", 4),
  FIVE: new SingleNumSeq("All Fives Sequence", "FIVE", "five(x)", 5),
  SIX: new SingleNumSeq("All Sixes Sequence", "SIX", "six(x)", 6),
  SEVEN: new SingleNumSeq("All Sevens Sequence", "SEVEN", "seven(x)", 7),
  EIGHT: new SingleNumSeq("All Eights Sequence", "EIGHT", "eight(x)", 8),
  NINE: new SingleNumSeq("All Nines Sequence", "NINE", "nine(x)", 9),
  TEN: new SingleNumSeq("All Tens Sequence", "TEN", "ten(x)", 10),
  ELEVEN: new SingleNumSeq("All 11 Albanias", "ELEVEN", "🇦🇱(x)", 11),
  TWELVE: new SingleNumSeq("Those 12 bees", "TWELVE", "🐝(x)", 12),
};
// trole !
