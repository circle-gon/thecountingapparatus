import {FunctionBase} from './functionClass.js';
import {gamma} from './factorial.js';

//Subclasses
  class NChooseR extends FunctionBase {
    constructor (name, unlock, syntax, input1, input2){
      super(name, unlock, syntax, (input1, input2)=>gamma(input1+1)/(gamma(input2+1)*gamma(input1-input2+1))); //n!/ (r! (n−r)!)
    }
  }

  class Logarithm extends FunctionBase {
    constructor (name, unlock, syntax, base){
      super(name, unlock, syntax, (input)=>Math.log(input)/Math.log(base));
    }
  }
  class SingleNumSeq extends FunctionBase {
    constructor (name, unlock, syntax, num) {
      super(name, unlock, syntax, (input)=>num)
    }
  }
//Functions (organize by unlock)
  const FUNCTIONS = {
    "A": new FunctionBase("Ackermann Function", "A", "A(x,y)", function A(x,y){
      switch (x){
        case 0:
          return y+1;
        case 1:
          return y+2;
        case 2:
          return 2*y+3;
        case 3:
          return 2**(y+3)-3;
        case 4:
          if (y=0) {
            return 13;
          } else return Infinity;
        default:
          return Infinity;
      }
    }), // that is not going to be good, just use the explicit versions and have anything above be Infinity
    // Is that better?
    // trole
    // what about 3? :torl:
    "SIN": new FunctionBase("Sine", "SIN", "sin(x)", Math.sin), //i hope this works
    "T": new FunctionBase("Triangular Numbers", "TN", "T(x)", (x) => (x*x/2+x/2)),
    "LN": new Logarithm("Natural Log", "LN", "ln(x)", Math.E),
    "LOG10": new Logarithm("Logarithm", "LOG", "log10(x)", 10),
    "LOG2": new Logarithm("Binary Logarithm", "BL", "log2(x)", 2),
    "CHOOSE": new NChooseR("nCr", "CHOOSE", "xCy"),
    "ZERO": new SingleNumSeq("All Zeros Sequence", "ZERO", "zero(x)", 0),
    "ONE": new SingleNumSeq("All Ones Sequence", "ONE","one(x)",1),
    "TWO": new SingleNumSeq("All Twos Sequence", "TWO","two(x)",2),
    "THREE": new SingleNumSeq("All Threes Sequence", "THREE","three(x)",3),
    "FOUR": new SingleNumSeq("All Fours Sequence", "FOUR","four(x)",4),
    "FIVE": new SingleNumSeq("All Fives Sequence", "FIVE","five(x)",5),
    "SIX": new SingleNumSeq("All Sixes Sequence", "SIX","six(x)",6),
    "SEVEN": new SingleNumSeq("All Sevens Sequence", "SEVEN","seven(x)",7),
    "EIGHT": new SingleNumSeq("All Eights Sequence", "EIGHT","eight(x)",8),
    "NINE": new SingleNumSeq("All Nines Sequence", "NINE","nine(x)",9),
    "TEN": new SingleNumSeq("All Tens Sequence", "TEN","ten(x)",10),
    "ELEVEN": new SingleNumSeq("All 11 Albanias", "ELEVEN", "🇦🇱(x)", 11),
    "TWELVE": new SingleNumSeq("Those 12 bees", "TWELVE", "🐝(x)", 12),
  }
// trole !