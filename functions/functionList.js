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

//Functions (organize by Unlock)
export const FUNCTIONS = {
  A: new Operator("Ackermann Function", "A", "A(a,b)", function (args) {
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

  B: new Operator(
    "Beta Function",
    "B",
    "B(x,y)",
    (args) =>
      (gamma(args[0] + 1) * gamma(args[1] + 1)) / gamma(args[0] + args[1] + 1)
  ),

  C: new Operator(
    "Catalan Numbers",
    "C",
    "C(x)",
    (args) => gamma(2 * args[0] + 1) / gamma(args[0] + 2) / gamma(args[0] + 1)
  ),

  H: new Operator("Harmonic Numbers", "H", "H(a,b)", function (args) {
    let output = 0;
    for (let i = 1; i <= args[0]; i++) {
      output += 1 / i ** args[1];
    }
    return output;
  }),

  J: new Operator("Bessel Function of the First Kind", "J", "J[n]x", (args) =>
    integral(
      (t) => Math.cos(args[0] * t - args[1] * Math.sin(t)) / Math.PI,
      0,
      Math.PI
    )
  ),

  K: new Operator("Hyperfactorial", "K", "K(x)", function (args) {
    let output = 1;
    for (let i = 1; i <= args[0]; i++) {
      output *= i ** i;
    }
    return output;
  }),

  L: new Operator(
    "Lucas Numbers",
    "L",
    "L(x)",
    (args) =>
      ((1 + Math.sqrt(5)) / 2) ** args[0] + ((1 - Math.sqrt(5)) / 2) ** args[0]
  ),

  Y: new Operator("Bessel Function of the Second Kind", "Y", "Y[n]x", (args) =>
    integral(
      (t) => Math.sin(args[1] * Math.sin(t) - args[0] * t) / Math.PI,
      0,
      Math.PI
    )
  ),

  AF: new Right("Alternating Factorial", "AF", "¡!", function (args) {
    let output = 0;
    const x = args[0];
    for (let i = 1; i <= x; i++) {
      output += gamma(i + 1) * (-1) ** (x - i);
    }
    return output;
  }),

  AS: new Operator("Aliquot Sum", "AS", "s(x)", function (args) {
    let sum = 0;
    for (let i = 1; i < args[0]; i++) {
      if (args[0] % i == 0) sum += i;
    }
    return sum;
  }),

  AT: new Operator("Area of a Triangle", "AT", "🔺(a,b,c)", function (args) {
    const a = args[0];
    const b = args[1];
    const c = args[2];
    return Math.sqrt((-a + b + c) * (a - b + c) * (a + b - c) * (a + b + c));
  }),

  CF: new Right("Central Factorial", "CF", "^[!]", function (args) {
    let output = 0;
    const x = args[0];
    for (let i = 1; i <= x - 2; i++) {
      for (let j = i + 1; j <= x - 1; j++) {
        output += i ** 2 * j ** 2;
      }
    }
    return output;
  }),

  CI: new Operator(
    "Cosine Integral",
    "CI",
    "Ci(x)",
    (args) =>
      0.5772156649015328 +
      Math.log(args[0]) +
      integral((t) => (Math.cos(t) - 1) / t, 0, args[0])
  ),

  DP: new Wrap("Ditigal Product", "DP", "(D*n)", function (args) {
    let output = 1;
    const x = args[0];
    for (const i of x.toString()) {
      output *= Number(i);
    }
    return output;
  }),

  FF: new Right(
    "Falling Factorial",
    "FF",
    "x_n",
    (args) => gamma(args[0] + 1) / gamma(args[0] - args[1] + 1)
  ),

  GM: new Operator("Geometric Mean", "GM", "gm(...)", (args) =>
    Math.pow(args.reduce((prev, curr) => prev * curr), 1 / args.length)
  ),

  HM: new Operator(
    "Harmonic Mean",
    "HM",
    "hm(...)",
    (args) =>
      1 / (args.reduce((prev, curr) => prev + 1 / curr, 0), 1 / args.length)
  ),

  IM: new Operator("Imaginary Part", "IM", "im(x)", (args) => 0),

  LF: new Left("Left Factorial", "LF", "¡", function (args) {
    let output = 0;
    for (let i = 0; i < args[0]; i++) {
      output += gamma(i + 1);
    }
    return output;
  }),

  LI: new Operator("Logarithmic Integral", "LI", "LI(x)", (args) =>
    integral((t) => 1 / Math.log(t), 0, args[0])
  ),

  LN: new Logarithm("Natural Log", "LN", "ln(x)", Math.E),

  OR: new Bin("Bitwise OR", "OR", "|", (args) => args[0] | args[1]),

  PF: new Right("Parity Factorial", "PF", "!!", function (args) {
    let output = 1;
    for (let i = args[0]; i > 0; i -= 2) {
      output *= i;
    }
    return output;
  }),

  PI: new Right("Pi Function", "PI", "!", (args) => gamma(args[0] + 1)),

  QF: new Right(
    "Quad Factorial",
    "QF",
    "!!!!",
    (args) => gamma(2 * args[0] + 1) / gamma(args[0] + 1)
  ),

  RE: new Operator("Real Part", "RE", "re(x)", (args) => args[0]),

  RF: new Right(
    "Rising Factorial",
    "FF",
    "_n",
    (args) => gamma(args[0] + args[1]) / gamma(args[0])
  ),

  SF: new Operator("Super Factorial", "SF", "sf(x)", function (args) {
    let output = 1;
    for (let i = 1; i <= args[0]; i++) {
      output *= gamma(i + 1);
    }
    return output;
  }),

  SI: new Operator("Sine Integral", "SI", "Si(x)", (args) =>
    integral((t) => Math.sin(t) / t, 0, args[0])
  ),

  TF: new Right("Triple Factorial", "TF", "!!!", function (args) {
    let output = 1;
    for (let i = args[0]; i > 0; i -= 3) output *= i;
    return output;
  }),

  TN: new NChooseR("Triangular Numbers", "TN", "T(x)", (x) => --x, 2),

  UR: new Operator("Unary Representation", "UR", "1️⃣(x)", (args) =>
    Math.floor(10 ** args[0] / 9)
  ),

  ABS: new Wrap("Absolute Value", "ABS", "|x|", Math.abs),

  ADD: new Bin("Addition", "ADD", "+", (args) => args[0] + args[1]),

  ADI: new Left("Additive Inverse", "ADI", "-", (args) => -args[0]),

  AND: new Bin("Bitwise And", "AND", "&", (args) => args[0] & args[1]),

  AVG: new Operator(
    "Arithmetic Mean",
    "AVG",
    "am(...)",
    (args) => args.reduce((prev, curr) => prev + curr) / args.length
  ),

  BIN: new Operator("Binary Numbers", "BIN", "bin[n](x)", (args) =>
    parseInt((args[1] >>> 0).toString(), args[0]).toString(2)
  ),

  BLG: new Logarithm("Binary Logarithm", "BLG", "log2(x)", 2),

  CAS: new Operator(
    "CAS Function",
    "CAS",
    "cas(x)",
    (args) => Math.sin(args[0]) + Math.cos(args[0])
  ),

  CAT: new Operator(
    "Czarnowski's Cat Function",
    "CAT",
    "🐱(x,n)",
    (args) => Math.sin(args[0]) ** args[1] + Math.cos(args[0])
  ),

  CHN: new Operator(
    "Centered Hexagonal Numbers",
    "CHN",
    "hex(x)",
    (args) => 3 * args[0] * (args[0] + 1) + 1
  ),
  COL: new Operator("Collatz Conjecture", "COL", "COL(x)", function (args) {
    let steps = 0;
    let num = args[0];
    while (num != 1) {
      if (num % 2 == 1) num = 3 * num + 1;
      else num /= 2;
      steps++;
    }
    return steps;
  }),
  COS: new Operator("Cosine", "COS", "cos(x)", Math.cos),

  COT: new Operator(
    "Cotangent",
    "COT",
    "cot(x)",
    (args) => 1 / Math.tan(args[0])
  ),

  CSC: new Operator(
    "Cosecent",
    "CSC",
    "csc(x)",
    (args) => 1 / Math.sin(args[0])
  ),

  DBL: new Operator("Doublets", "DBL", "2️⃣(x)", (args) =>
    Number(args[0].toString().repeat(2))
  ),

  DEC: new Operator("Decimal Numbers", "DEC", "dec[n](x)", (args) =>
    parseInt((args[1] >>> 0).toString(), args[0]).toString(10)
  ),
  DEF: new Operator("Number Deficiency", "DEF", "def(x)", function (args) {
    let sum = 0;
    for (let i = 1; i < args[0]; i++) {
      if (args[0] % i == 0) sum += i;
    }
    return args[0] - sum; // def(x) = x-s(x)
  }),
  DIV: new Bin("Division", "DIV", "/", (args) => args[0] / args[1]),

  DRT: new Left(
    "Digital Root",
    "DRT",
    "D√)",
    (args) => ((args[0] - 1) % 9) + 1
  ),

  DSM: new Left("Digit Sum", "DSM", "D+", function (args) {
    args[0] = args[0].toString();
    let output = 0;
    for (let i = 0; i < args[0].length; i++) {
      output += parseInt(args[0].charAt(i));
    }
    return output;
  }),

  DWS: new Operator(
    "Derangement Weighted Sum",
    "DWS",
    "dws(n)",
    (args) => 1 - args[0]
  ),
  EGG: new Operator("Egg", "EGG", "🥚(x)", (args) => 420 * args[0] - 119),
  ENG: new Operator("English", "ENG", "eng(n)", function eng(args) {
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
        eng([Math.floor(x / 10 ** (3 * Math.floor(Math.log10(x) / 3)))]) +
        suffix +
        (x % 10 ** (3 * Math.floor(Math.log10(x) / 3))
          ? eng([x % 10 ** (3 * Math.floor(Math.log10(x) / 3))])
          : 0)
      );
    }
  }),

  ERF: new Operator("Error Function", "ERF", "erf(x)", (args) =>
    integral((t) => (2 * Math.E ** -(t ** 2)) / Math.sqrt(Math.PI), 0, args[0])
  ),

  EXP: new Operator("Exponential Function", "EXP", "exp(x)", Math.exp),

  FIB: new Operator("Fibonacci Numbers", "FIB", "fib(n)", (args) =>
    Math.round(
      (((1 + Math.sqrt(5)) / 2) ** args[0] -
        ((1 - Math.sqrt(5)) / 2) ** args[0]) /
        ((1 + Math.sqrt(5)) / 2 - (1 - Math.sqrt(5)) / 2)
    )
  ),

  GCD: new Operator("Greatest Common Denominator", "GCD", "gcd(...)", (args) =>
    args.reduce(function gcd(a, b) {
      return b ? gcd(b, a % b) : a;
    })
  ),

  IMP: new Operator(
    "Impolite Numbers",
    "IMP",
    "😠(n)",
    (args) => args[0] + 2 ** (args[0] - 1)
  ),

  INT: new Operator("Integral", "INT", "∫(f,dx,LB,UB)", (args) =>
    integral(args[0], args[2], args[3])
  ),

  LAH: new Operator(
    "Unsigned Lah Numbers",
    "LAH",
    "lah(n,k)",
    (args) =>
      (gamma(args[0] + 1) * gamma(args[0])) /
      gamma(args[1] + 1) /
      gamma(args[1]) /
      gamma(args[0] - args[1] + 1)
  ),

  LCM: new Operator("Least Common Multiple", "LCM", "lcm(...)", function (
    args
  ) {
    const gcd = (a, b) => (b ? gcd(b, a % b) : a);
    return args.reduce((a, b) => (a * b) / gcd(a, b));
  }),

  LCS: new Operator(
    "Lazy Caterer's Sequence",
    "LCS",
    "lc(n)",
    (args) => (args[0](args[0] + 1) + 2) / 2
  ),

  LEO: new Operator("Leonardo Numbers", "LEO", "leo(n)", (args) =>
    Math.round(
      (2 / Math.sqrt(5)) *
        (((1 + Math.sqrt(5)) / 2) ** (args[0] + 1) -
          ((1 - Math.sqrt(5)) / 2) ** (args[0] + 1)) +
        1
    )
  ),

  LIG: new Operator(
    "Lower Incomplete Gamma Function",
    "LIG",
    "γ(x,y)",
    (args) => integral((t) => t ** (args[0] - 1) * Math.exp(-t), 0, args[1])
  ),

  LOG: new Logarithm("Logarithm", "LOG", "log(x)", 10),

  MAX: new Operator("Maximum", "MAX", "max(...)", Math.max),

  MIN: new Operator("Minimum", "MIN", "min(...)", Math.min),

  MLT: new Bin("Multiply", "MLT", "*", (args) => args[0] * args[1]),

  MOD: new Bin("Modulo", "MOD", "%", (args) => args[0] % args[1]),

  NOT: new Right(
    "Bitwise Not",
    "NOT",
    "~",
    (args) => 2 ** Math.ceil(Math.log2(args[0])) + ~args[0]
  ),

  ODD: new Operator("Odd Numbers", "ODD", "odd(n)", (args) => 2 * args[0] + 1),

  ONE: new SingleNumSeq("All Ones Sequence", "ONE", "one(x)", 1),

  POW: new Bin("Power", "POW", "^", (args) => args[0] ** args[1]),

  PRE: new Right("Predecessor", "PRE", "--", (args) => --args[0]),

  RMS: new Operator("Root Mean Square", "RMS", "rms(...)", (args) =>
    Math.sqrt(args.reduce((prev, curr) => prev + curr ** 2, 0) / args.length)
  ),

  SEC: new Operator("Secant", "SEC", "sec(x)", (args) => 1 / Math.cos(args[0])),

  SIN: new FunctionBase("Sine", "SIN", "sin(x)", Math.sin),

  SIX: new SingleNumSeq("All Sixes Sequence", "SIX", "six(x)", 6),

  SQR: new Right("Square Numbers", "SQR", "²", (args) => args[0] ** 2),

  SUB: new Bin("Subtraction", "SUB", "-", (args) => args[0] - args[1]),

  SUC: new Right("Succ Deez Nuts", "SUC", "++", (args) => ++args[0]),

  SWF: new Right(
    "Swinging Factorial",
    "SWF",
    "≀",
    (args) => gamma(args[0] + 1) / gamma(Math.floor(args[0] / 2) + 1) ** 2
  ),

  TAN: new FunctionBase("Tangent", "TAN", "tan(x)", Math.tan),

  TEN: new SingleNumSeq("All Tens Sequence", "TEN", "ten(x)", 10),

  TPL: new FunctionBase("Triplets", "DBL", "3️⃣(x)", (args) =>
    Number(args[0].toString().repeat(3))
  ),

  TRI: new FunctionBase("Tribonacci Sequence", "TRI", "Tr(x)", function (args) {
    const a = Math.cbrt(19 + 3 * Math.sqrt(33));
    const a_ = Math.cbrt(19 - 3 * Math.sqrt(33));
    const b = Math.cbrt(586 + 102 * Math.sqrt(33));
    return Math.round(
      (3 * b * ((a + a_ + 1) / 3) ** args[0]) / (b ** 2 - 2 * b + 4)
    );
  }),

  TWO: new SingleNumSeq("All Twos Sequence", "TWO", "two(x)", 2),

  UIG: new Operator(
    "Upper Incomplete Gamma Function",
    "UIG",
    "uig(x)",
    (args) =>
      gamma(args[0]) -
      integral((t) => t ** (args[0] - 1) * Math.exp(-t), 0, args[1])
  ),

  XOR: new Bin("Bitwise XOR", "XOR", "^", (args) => args[0] ^ args[1]),

  FIVE: new SingleNumSeq("All Fives Sequence", "FIVE", "five(x)", 5),

  FOUR: new SingleNumSeq("All Fours Sequence", "FOUR", "four(x)", 4),

  NINE: new SingleNumSeq("All Nines Sequence", "NINE", "nine(x)", 9),

  ZERO: new SingleNumSeq("All Zeros Sequence", "ZERO", "zero(x)", 0),

  EIGHT: new SingleNumSeq("All Eights Sequence", "EIGHT", "eight(x)", 8),

  SEVEN: new SingleNumSeq("All Sevens Sequence", "SEVEN", "seven(x)", 7),

  THREE: new SingleNumSeq("All Threes Sequence", "THREE", "three(x)", 3),

  CHOOSE: new NChooseR("nCr", "CHOOSE", "xCy"),

  ELEVEN: new SingleNumSeq("All 11 Albanias", "ELEVEN", "🇦🇱(x)", 11),

  TWELVE: new SingleNumSeq("Those 12 bees", "TWELVE", "🐝(x)", 12),
};
// trole !
