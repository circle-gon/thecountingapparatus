import { FunctionBase } from "./functionClass.js";
import { gamma, integral } from "../utils/utils.js";

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

export class Operator extends FunctionBase {
  constructor(name, unlock, symbol, evaluate) {
    super(name, unlock, symbol, evaluate);
  }
}

export class Left extends Operator {
  constructor(name, unlock, symbol, evaluate) {
    super(name, unlock, symbol, evaluate);
  }
}

export class Right extends Operator {
  constructor(name, unlock, symbol, evaluate) {
    super(name, unlock, symbol, evaluate);
  }
}

class Wrap extends Operator {
  constructor(name, unlock, symbol, evaluate) {
    super(name, unlock, symbol, evaluate);
  }
}

export class Bin extends Operator {
  constructor(name, unlock, symbol, evaluate) {
    super(name, unlock, symbol, evaluate);
  }
}

class Integral extends FunctionBase {
  constructor(name, unlock, syntax, evaluate) {
    super(name, unlock, syntax, evaluate);
  }
}
//Functions (organize by Unlock)
export const FUNCTIONS = {
  A: new FunctionBase("Ackermann Function", "A", "A(a,b)", function (args) {
    switch (args[0]) {
      case 0:
        return args[1] + 1;
      case 1:
        return args[1] + 2;
      case 2:
        return 2 * args[1] + 3;
      case 3:
        return 2 ** (args[1] + 3) - 3;
      case 4:
        if (args[1] === 0) return 13;
        else if (args[1] === 1) return 65533;
        else return Infinity;
      case 5:
        if (args[1] === 0) return 65533;
        else return Infinity;
      default:
        return Infinity;
    }
  }),

  B: new FunctionBase(
    "Beta Function",
    "B",
    "B(x,y)",
    (args) =>
      (gamma(args[0] + 1) * gamma(args[1] + 1)) / gamma(args[0] + args[1] + 1)
  ),

  C: new FunctionBase(
    "Catalan Numbers",
    "C",
    "C(x)",
    (args) => gamma(2 * args[0] + 1) / gamma(args[0] + 2) / gamma(args[0] + 1)
  ),

  H: new FunctionBase("Harmonic Numbers", "H", "H(a,b)", function (args) {
    let output = 0;
    for (let i = 1; i <= args[0]; i++) {
      output += 1 / i ** args[1];
    }
    return output;
  }),

  J: new Integral("Bessel Function of the First Kind", "J", "J[n]x", (args) =>
    integral(
      (t) => Math.cos(args[0] * t - args[1] * Math.sin(t)) / Math.PI,
      0,
      Math.PI
    )
  ),

  L: new FunctionBase(
    "Lucas Numbers",
    "L",
    "L(x)",
    (args) =>
      ((1 + Math.sqrt(5)) / 2) ** args[0] + ((1 - Math.sqrt(5)) / 2) ** args[0]
  ),

  Y: new Integral("Bessel Function of the Second Kind", "Y", "Y[n]x", (args) =>
    integral(
      (t) => Math.sin(args[1] * Math.sin(t) - args[0] * t) / Math.PI,
      0,
      Math.PI
    )
  ),

  AF: new FunctionBase("Alternating Factorial", "AF", "x¡!", function (args) {
    let output = 0;
    const x = args[0];
    for (let i = 1; i <= x; i++) {
      output += gamma(i + 1) * (-1) ** (x - i);
    }
    return output;
  }),

  AT: new FunctionBase("Area of a Triangle", "AT", "🔺(a,b,c)", function (
    args
  ) {
    const a = args[0];
    const b = args[1];
    const c = args[2];
    return Math.sqrt((-a + b + c) * (a - b + c) * (a + b - c) * (a + b + c));
  }),

  CF: new FunctionBase("Central Factorial", "CF", "x^[!]", function (args) {
    let output = 0;
    const x = args[0];
    for (let i = 1; i <= x - 2; i++) {
      for (let j = i + 1; j <= x - 1; j++) {
        output += i ** 2 * j ** 2;
      }
    }
    return output;
  }),

  CI: new Integral(
    "Cosine Integral",
    "CI",
    "Ci(x)",
    (args) =>
      0.5772156649015328 +
      Math.log(args[0]) +
      integral((t) => (Math.cos(t) - 1) / t, 0, args[0])
  ),

  DP: new FunctionBase("Ditigal Product", "DP", "(D*n)", function (args) {
    let output = 1;
    const x = args[0];
    for (const i of x.toString()) {
      output *= Number(i)
    }
    return output;
  }),

  FF: new FunctionBase(
    "Falling Factorial",
    "FF",
    "x_n",
    (args) => gamma(args[0] + 1) / gamma(args[0] - args[1] + 1)
  ),

  LF: new FunctionBase("Left Factorial", "LF", "¡x", function (args) {
    let output = 0;
    for (let i = 0; i < args[0]; i++) {
      output += gamma(i + 1);
    }
    return output;
  }),

  LI: new Integral("Logarithmic Integral", "LI", "LI(x)", (args) =>
    integral((t) => 1 / Math.log(t), 0, args[0])
  ),

  LN: new Logarithm("Natural Log", "LN", "ln(x)", Math.E),

  OR: new Bin("Bitwise OR", "OR", "a|b", (args) => args[0] | args[1]),

  PF: new FunctionBase("Pairity Factorial", "PF", "x!!", function (args) {
    let output = 1;
    for (let i = args[0]; i > 0; i -= 2) {
      output *= i;
    }
  }),

  PI: new FunctionBase("Pi Function", "PI", "x!", (args) => gamma(args[0] + 1)),

  QF: new FunctionBase(
    "Quad Factorial",
    "QF",
    "x!!!!",
    (args) => gamma(2 * args[0] + 1) / gamma(args[0] + 1)
  ),

  RF: new FunctionBase(
    "Rising Factorial",
    "FF",
    "x_n",
    (args) => gamma(args[0] + args[1]) / gamma(args[0])
  ),

  SF: new FunctionBase("Super Factorial", "SF", "sf(x)", function (args) {
    let output = 1;
    for (let i = 1; i <= args[0]; i++) {
      output *= gamma(i + 1);
    }
    return output;
  }),

  SI: new Integral("Sine Integral", "SI", "Si(x)", (args) =>
    integral((t) => Math.sin(t) / t, 0, args[0])
  ),

  TF: new FunctionBase("Triple Factorial", "TF", "x!!!", function (args) {
    let output = 1;
    for (let i = args[0]; i > 0; i -= 3) output *= i;
    return output;
  }),

  TN: new NChooseR("Triangular Numbers", "TN", "T(x)", (x) => --x, 2),

  UN: new FunctionBase("Unary Representation", "UN", "1️⃣(x)", (args) =>
    Math.floor(10 ** args[0] / 9)
  ),

  ABS: new FunctionBase("Absolute Value", "ABS", "|x|", Math.abs),

  ADD: new FunctionBase("Addition", "ADD", "a+b", (args) => args[0] + args[1]),

  ADI: new FunctionBase("Additive Inverse", "ADI", "-x", (args) => -args[0]),

  AND: new Bin("Bitwise And", "AND", "a&b", (args) => args[0] & args[1]),

  BIN: new Bin("Binary Numbers", "BIN", "bin[n](x)", (args) =>
    parseInt((args[1] >>> 0).toString(), args[0]).toString(2)
  ),

  BLG: new Logarithm("Binary Logarithm", "BLG", "log2(x)", 2),

  CAS: new FunctionBase(
    "CAS Function",
    "CAS",
    "cas(x)",
    (args) => Math.sin(args[0]) + Math.cos(args[0])
  ),

  CAT: new FunctionBase(
    "Czarnowski's Cat Function",
    "CAT",
    "🐱(x,n)",
    (args) => Math.sin(args[0]) ** args[1] + Math.cos(args[0])
  ),

  CHN: new FunctionBase(
    "Centered Hexagonal Numbers",
    "CHN",
    "hex(x)",
    (args) => 3 * args[0] * (args[0] + 1) + 1
  ),

  COS: new FunctionBase("Cosine", "COS", "cos(x)", Math.cos),

  COT: new FunctionBase(
    "Cotangent",
    "COT",
    "cot(x)",
    (args) => 1 / Math.tan(args[0])
  ),

  CSC: new FunctionBase(
    "Cosecent",
    "CSC",
    "csc(x)",
    (args) => 1 / Math.sin(args[0])
  ),

  DBL: new FunctionBase(
    "Doublets",
    "DBL",
    "2️⃣(x)",
    (args) => args[0] + 10 ** Math.floor(Math.log10(args[0]) + 1) * args[0]
  ),

  DEC: new Bin("Decimal Numbers", "DEC", "dec[n](x)", (args) =>
    parseInt((args[1] >>> 0).toString(), args[0]).toString(10)
  ),

  //DET: new FunctionBase("Determinant", "DET", "det(A)", )

  DIV: new FunctionBase("Division", "DIV", "x/y", (args) => args[0] / args[1]),

  DRT: new FunctionBase("Digital Root", "DRT", "D√n)", function drt(args) {
    let input = args[0].toString();
    if (input.length === 1) return parseInt(input);
    else {
      let output = 0;
      for (let i = 0; i < input.length; i++) {
        output += parseInt(input.charAt(i));
      }
      return drt([output]);
    }
  }),

  DSM: new FunctionBase("Digit Sum", "DSM", "D+n", function (args) {
    args[0] = args[0].toString();
    let output = 0;
    for (let i = 0; i < args[0].length; i++) {
      output += parseInt(args[0].charAt(i));
    }
    return output;
  }),

  DWS: new FunctionBase(
    "Derangement Weighted Sum",
    "DWS",
    "dws(n)",
    (args) => 1 - args[0]
  ),

  ENG: new FunctionBase("English", "ENG", "eng(n)", function eng(args) {
    let x = args[0];
    if (x === 0) return 4;
    let val = 0;
    if (x < 1e3) {
      val += [0, 10, 10, 12, 11, 11, 10, 12, 12, 11][Math.floor(x / 100)]; //Hundreds
      if (Math.floor((x % 100) / 10) === 1) {
        val += [3, 6, 6, 8, 8, 7, 7, 9, 9, 8][(x % 100) - 10]; //Teens
      } else {
        val += [0, 0, 6, 6, 5, 5, 5, 7, 7, 6][Math.floor((x % 100) / 10)]; //Tens
        val += [0, 3, 3, 5, 4, 4, 3, 5, 5, 4][Math.floor(x % 10)]; //Ones
      }

      return val;
    } else {
      let suffix = [0, 8, 7, 7, 8, 11, 11, 10, 10, 9, 9, 9, 11, 12, 12, 17][
        Math.floor(Math.log10(x) / 3)
      ];
      return (
        suffix +
        eng([Math.floor(x / 10 ** (3 * Math.floor(Math.log10(x) / 3)))]) +
        eng([x % 10 ** (3 * Math.floor(Math.log10(x) / 3))])
      );
    }
  }),

  ERF: new Integral("Error Function", "ERF", "erf(x)", (args) => integral((t) => 2*Math.E**(-(t**2))/Math.sqrt(Math.PI), 0, args[0])),
  
  LOG: new Logarithm("Logarithm", "LOG", "log10(x)", 10),

  SIN: new FunctionBase("Sine", "SIN", "sin(x)", Math.sin),

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

  SUBTRACTION: new Bin("Subtraction", "SUB", "-", (x, y) => x - y),

  MULTIPLICATION: new Bin("Multiply", "MLT", "*", (x, y) => x * y),

  EXPONENTIATION: new Bin("Power", "POW", "+", (x, y) => x ** y),

  FACTORIAL: new Right("Factorial", "PI", "!", (x) => gamma(x + 1)),

  MODULO: new Bin("Modulo", "MOD", "%", (x, y) => x % y),

  PREDECESSOR: new Right("Predecessor", "PRE", "--", (x, y) => --x),

  SUCCESSOR: new Right("Successor", "SUC", "++", (args) => ++args[0]),
};
// trole !
