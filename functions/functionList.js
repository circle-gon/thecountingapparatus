import { FunctionBase } from "./functionClass.js";
import { factorial, gamma } from "../utils/utils.js";
import { integral, ladd, prime, nCr } from "./functionUtils.js";

export class Func extends FunctionBase {}

export class Left extends FunctionBase {}

export class Right extends FunctionBase {}

export class Wrap extends FunctionBase {}

export class Bin extends FunctionBase {}

export class Subscript extends FunctionBase {}

//Subclasses
class Logarithm extends Func {
  constructor(name, unlock, syntax, base) {
    super(name, unlock, syntax, (input) => Math.log(input) / Math.log(base));
  }
}
class SingleNumSeq extends Func {
  constructor(name, unlock, syntax, num) {
    super(name, unlock, syntax, (args) => num);
  }
}

//Functions (organize by Unlock)
export const FUNCTIONS = {
  A: new Func("Ackermann Function", "A", "A(a,b)", function (args) {
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

  B: new Func(
    "Beta Function",
    "B",
    "B(x,y)",
    (args) =>
      (gamma(args[0] + 1) * gamma(args[1] + 1)) / gamma(args[0] + args[1] + 1)
  ),

  C: new Func(
    "Catalan Numbers",
    "C",
    "C(x)",
    (args) => gamma(2 * args[0] + 1) / gamma(args[0] + 2) / gamma(args[0] + 1)
  ),

  H: new Func("Harmonic Numbers", "H", "H(a,b)", function (args) {
    let output = 0;
    for (let i = 1; i <= args[0]; i++) {
      output += 1 / i ** args[1];
    }
    return output;
  }),

  J: new Subscript("Bessel Function of the First Kind", "J", "J[n]x", (args) =>
    integral(
      (t) => Math.cos(args[0] * t - args[1] * Math.sin(t)) / Math.PI,
      0,
      Math.PI
    )
  ),

  K: new Func("Hyperfactorial", "K", "K(x)", function (args) {
    let output = 1;
    for (let i = 1; i <= args[0]; i++) {
      output *= i ** i;
    }
    return output;
  }),

  L: new Func(
    "Lucas Numbers",
    "L",
    "L(x)",
    (args) =>
      ((1 + Math.sqrt(5)) / 2) ** args[0] + ((1 - Math.sqrt(5)) / 2) ** args[0]
  ),

  Y: new Subscript("Bessel Function of the Second Kind", "Y", "Y[n]x", (args) =>
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

  AS: new Func("Aliquot Sum", "AS", "s(x)", function (args) {
    let sum = 0;
    for (let i = 1; i < args[0]; i++) {
      if (args[0] % i == 0) sum += i;
    }
    return sum;
  }),

  AT: new Func("Area of a Triangle", "AT", "🔺(a,b,c)", function (args) {
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

  CI: new Func(
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

  GM: new Func(
    "Geometric Mean",
    "GM",
    "gm(...)",
    (args) => args.reduce((prev, curr) => prev * curr) ** (1 / args.length)
  ),

  HM: new Func(
    "Harmonic Mean",
    "HM",
    "hm(...)",
    (args) =>
      1 / (args.reduce((prev, curr) => prev + 1 / curr, 0), 1 / args.length)
  ),
  HP: new Func("Hyperprime", "HP", "hp(x)", (args) =>
    prime(prime(prime(args[0])))
  ),
  IM: new Func("Imaginary Part", "IM", "im(x)", (args) => 0),

  LF: new Left("Left Factorial", "LF", "¡", function (args) {
    let output = 0;
    for (let i = 0; i < args[0]; i++) {
      output += gamma(i + 1);
    }
    return output;
  }),

  LI: new Func("Logarithmic Integral", "LI", "LI(x)", (args) =>
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

  PI: new Right("Pi Function", "PI", "!", (args) => gamma(args[0])),

  QF: new Right(
    "Quad Factorial",
    "QF",
    "!!!!",
    (args) => gamma(2 * args[0] + 1) / gamma(args[0] + 1)
  ),

  RE: new Func("Real Part", "RE", "re(x)", (args) => args[0]),

  RF: new Right(
    "Rising Factorial",
    "FF",
    "_n",
    (args) => gamma(args[0] + args[1]) / gamma(args[0])
  ),

  SF: new Func("Super Factorial", "SF", "sf(x)", function (args) {
    let output = 1;
    for (let i = 1; i <= args[0]; i++) {
      output *= gamma(i + 1);
    }
    return output;
  }),

  SI: new Func("Sine Integral", "SI", "Si(x)", (args) =>
    integral((t) => Math.sin(t) / t, 0, args[0])
  ),

  SP: new Func("Superprime", "SP", "sp(x)", (args) => prime(prime(args[0]))),

  TF: new Right("Triple Factorial", "TF", "!!!", function (args) {
    let output = 1;
    for (let i = args[0]; i > 0; i -= 3) output *= i;
    return output;
  }),

  TN: new Func(
    "Triangular Numbers",
    "TN",
    "T(x)",
    (args) => (args[0] ** 2 + args[0]) / 2
  ),

  UR: new Func("Unary Representation", "UR", "1️⃣(x)", (args) =>
    Math.floor(10 ** args[0] / 9)
  ),

  ABS: new Wrap("Absolute Value", "ABS", "|x|", Math.abs),

  ADD: new Bin("Addition", "ADD", "+", (args) => args[0] + args[1]),

  ADI: new Left("Additive Inverse", "ADI", "-", (args) => -args[0]),

  AND: new Bin("Bitwise AND", "AND", "&", (args) => args[0] & args[1]),

  AVG: new Func(
    "Arithmetic Mean",
    "AVG",
    "am(...)",
    (args) => args.reduce((prev, curr) => prev + curr) / args.length
  ),

  BIN: new Subscript("Binary Numbers", "BIN", "bin[n](x)", (args) =>
    parseInt((args[1] >>> 0).toString(), args[0]).toString(2)
  ),

  BLG: new Logarithm("Binary Logarithm", "BLG", "log2(x)", 2),

  CAS: new Func(
    "CAS Function",
    "CAS",
    "cas(x)",
    (args) => Math.sin(args[0]) + Math.cos(args[0])
  ),

  CAT: new Func(
    "Czarnowski's Cat Function",
    "CAT",
    "🐱(x,n)",
    (args) => Math.sin(args[0]) ** args[1] + Math.cos(args[0])
  ),

  CHN: new Func(
    "Centered Hexagonal Numbers",
    "CHN",
    "hex(x)",
    (args) => 3 * args[0] * (args[0] + 1) + 1
  ),
  COL: new Func("Collatz Conjecture", "COL", "COL(x)", function (args) {
    let steps = 0;
    let num = args[0];
    while (num != 1) {
      if (num % 2 == 1) num = 3 * num + 1;
      else num /= 2;
      steps++;
    }
    return steps;
  }),
  COS: new Func("Cosine", "COS", "cos(x)", Math.cos),

  COT: new Func("Cotangent", "COT", "cot(x)", (args) => 1 / Math.tan(args[0])),

  CSC: new Func("Cosecent", "CSC", "csc(x)", (args) => 1 / Math.sin(args[0])),

  DBL: new Func("Doublets", "DBL", "2️⃣(x)", (args) =>
    Number(args[0].toString().repeat(2))
  ),

  DEC: new Subscript("Decimal Numbers", "DEC", "dec[n](x)", (args) =>
    parseInt((args[1] >>> 0).toString(), args[0]).toString(10)
  ),
  DEF: new Func("Number Deficiency", "DEF", "def(x)", function (args) {
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

  DWS: new Func(
    "Derangement Weighted Sum",
    "DWS",
    "dws(n)",
    (args) => 1 - args[0]
  ),

  EGG: new Func("Egg", "EGG", "🥚(x)", (args) => 420 * args[0] - 119),

  ENG: new Func("English", "ENG", "eng(n)", function eng(args) {
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

  ERF: new Func("Error Function", "ERF", "erf(x)", (args) =>
    integral((t) => (2 * Math.E ** -(t ** 2)) / Math.sqrt(Math.PI), 0, args[0])
  ),

  EXP: new Func("Exponential Function", "EXP", "exp(x)", Math.exp),

  FIB: new Func("Fibonacci Numbers", "FIB", "fib(n)", (args) =>
    Math.round(
      (((1 + Math.sqrt(5)) / 2) ** args[0] -
        ((1 - Math.sqrt(5)) / 2) ** args[0]) /
        ((1 + Math.sqrt(5)) / 2 - (1 - Math.sqrt(5)) / 2)
    )
  ),

  GCD: new Func("Greatest Common Denominator", "GCD", "gcd(...)", (args) =>
    args.reduce(function gcd(a, b) {
      return b ? gcd(b, a % b) : a;
    })
  ),

  //GWA

  IMP: new Func(
    "Impolite Numbers",
    "IMP",
    "😠(n)",
    (args) => args[0] + 2 ** (args[0] - 1)
  ),

  INT: new Func("Integral", "INT", "∫(f,dx,LB,UB)", (args) =>
    integral(args[0], args[2], args[3])
  ),

  LAH: new Func(
    "Unsigned Lah Numbers",
    "LAH",
    "Lah(n,k)",
    (args) =>
      (gamma(args[0] + 1) * gamma(args[0])) /
      gamma(args[1] + 1) /
      gamma(args[1]) /
      gamma(args[0] - args[1] + 1)
  ),

  LCM: new Func("Least Common Multiple", "LCM", "lcm(...)", function (args) {
    const gcd = (a, b) => (b ? gcd(b, a % b) : a);
    return args.reduce((a, b) => (a * b) / gcd(a, b));
  }),

  LCS: new Func(
    "Lazy Caterer's Sequence",
    "LCS",
    "lc(n)",
    (args) => (args[0](args[0] + 1) + 2) / 2
  ),

  LEO: new Func("Leonardo Numbers", "LEO", "leo(n)", (args) =>
    Math.round(
      (2 / Math.sqrt(5)) *
        (((1 + Math.sqrt(5)) / 2) ** (args[0] + 1) -
          ((1 - Math.sqrt(5)) / 2) ** (args[0] + 1)) +
        1
    )
  ),

  LIG: new Func("Lower Incomplete Gamma Function", "LIG", "γ(x,y)", (args) =>
    integral((t) => t ** (args[0] - 1) * Math.exp(-t), 0, args[1])
  ),

  LOG: new Logarithm("Logarithm", "LOG", "log(x)", 10),

  MAX: new Func("Maximum", "MAX", "max(...)", Math.max),

  MIN: new Func("Minimum", "MIN", "min(...)", Math.min),

  MLT: new Bin("Multiply", "MLT", "*", (args) => args[0] * args[1]),

  MOD: new Bin("Modulo", "MOD", "%", (args) => args[0] % args[1]),

  NOT: new Right(
    "Bitwise NOT",
    "NOT",
    "~",
    (args) => 2 ** Math.floor(Math.log2(args[0]) + 1) + ~args[0]
  ),

  ODD: new Func("Odd Numbers", "ODD", "odd(n)", (args) => 2 * args[0] + 1),

  ONE: new SingleNumSeq("All Ones Sequence", "ONE", "one(x)", 1),

  POW: new Bin("Power", "POW", "^", (args) => args[0] ** args[1]),

  PRE: new Right("Predecessor", "PRE", "--", (args) => --args[0]),
  PRI: new Func("Primorial", "PRI", "x#", (args) => {
    let result = 1;
    for (let i = 1; i <= args[0]; i++) {
      result *= prime(i);
    }
    return result;
  }),
  RMS: new Func("Root Mean Square", "RMS", "rms(...)", (args) =>
    Math.sqrt(args.reduce((prev, curr) => prev + curr ** 2, 0) / args.length)
  ),

  SEC: new Func("Secant", "SEC", "sec(x)", (args) => 1 / Math.cos(args[0])),

  SIN: new Func("Sine", "SIN", "sin(x)", Math.sin),

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

  TAN: new Func("Tangent", "TAN", "tan(x)", Math.tan),

  TEN: new SingleNumSeq("All Tens Sequence", "TEN", "ten(x)", 10),

  TPL: new Func("Triplets", "DBL", "3️⃣(x)", (args) =>
    Number(args[0].toString().repeat(3))
  ),

  TRI: new Func("Tribonacci Sequence", "TRI", "Tr(x)", function (args) {
    const a = Math.cbrt(19 + 3 * Math.sqrt(33));
    const a_ = Math.cbrt(19 - 3 * Math.sqrt(33));
    const b = Math.cbrt(586 + 102 * Math.sqrt(33));
    return Math.round(
      (3 * b * ((a + a_ + 1) / 3) ** args[0]) / (b ** 2 - 2 * b + 4)
    );
  }),

  TWO: new SingleNumSeq("All Twos Sequence", "TWO", "two(x)", 2),

  UIG: new Func(
    "Upper Incomplete Gamma Function",
    "UIG",
    "uig(x)",
    (args) =>
      gamma(args[0]) -
      integral((t) => t ** (args[0] - 1) * Math.exp(-t), 0, args[1])
  ),

  XOR: new Bin("Bitwise XOR", "XOR", "^", (args) => args[0] ^ args[1]),

  CAKE: new Func(
    "Cake Numbers",
    "CAKE",
    "🍰(x)",
    (args) => (args[0] ** 3 + 5 * args[0] + 6) / 3
  ),

  CBRT: new Left("Cube Root", "CBRT", "³√", Math.cbrt),

  CEIL: new Wrap("Ceiling Function", "CEIL", "⌈x⌉", Math.ceil),

  COSH: new Func("Hyperbolic Cosine", "COSH", "cosh(x)", Math.cosh),

  COTH: new Func(
    "Hyperbolic Tangent",
    "COTH",
    "coth(x)",
    (args) => Math.sinh(args[0]) / Math.cosh(args[1])
  ),

  CSQR: new Func(
    "Centered Square Numbers",
    "CSQR",
    "cs(n)",
    (args) => args[0] ** 2 + (args[0] - 1) ** 2
  ),

  CSQR: new Func(
    "Centered Triangular Numbers",
    "CTRI",
    "ct(n)",
    (args) => (3 * args[0] ** 2 + 3 * args[0] + 2) / 2
  ),

  CUBE: new Right("Cubes", "CUBE", "³", (args) => args[0] ** 3),

  EVEN: new Func("Even Numbers", "EVEN", "even(n)", (args) => 2 * args[0]),
  
  FAST: new Subscript("Fast Growing Hierarchy", "FAST", "fgh[a](x)", ),

  FIVE: new SingleNumSeq("All Fives Sequence", "FIVE", "five(x)", 5),

  FOUR: new SingleNumSeq("All Fours Sequence", "FOUR", "four(x)", 4),

  LADD: new Bin("Lunar Addition", "LADD", "(L+)", ladd),

  LAHS: new Func(
    "Signed Lah Numbers",
    "LAHS",
    "Lahs(n,k)",
    (args) =>
      ((-1) ** args[0] * gamma(args[0] + 1) * gamma(args[0])) /
      (gamma(args[1] + 1) * gamma(args[1]) * gamma(args[0] - args[1] + 1))
  ),

  LEFT: new Bin("Bitshift Left", "LEFT", "<<", (args) => args[0] << args[1]),

  LMLT: new Bin("Lunar Multiplication", "LMLT", "(L*)", function (args) {
    let output = [];
    output.fill(
      "",
      0,
      Math.max(args[0].toString().length, args[1].toString.length)
    );
    for (let i = 0; i < args[1].toString().length; i++) {
      for (let j = 0; j < args[0].toString().length; j++) {
        output[i] =
          Math.min(
            parseInt(args[1].toString().at(i)),
            parseInt(args[0].toString().at(j))
          ).toString() + output[i];
      }
      output[i] += "0".repeat(args[1].toString().length - i);
    }
    return output.reduce((curr, prev) => ladd(curr, prev));
  }),

  LOBB: new Func(
    "Lobb Numbers",
    "LOBB",
    "lobb(a,b)",
    (args) =>
      (((2 * args[0] + 1) / (args[0] + args[1] + 1)) * gamma(2 * args[1] + 1)) /
      gamma(args[0] + args[1] + 1) /
      gamma(args[1] - args[0] + 1)
  ),

  LOGN: new Func(
    "Logarithm",
    "LOGN",
    "log_n(x)",
    (args) => Math.log(args[1]) / Math.log(args[0])
  ),

  LTRI: new Func("Lunar Triangle Numbers", "LTRI", "L∆(n)", (args) =>
    args[0] < 10
      ? args[0]
      : (1 + Math.floor(args[0] / 10 ** Math.floor(Math.log10(args[0])))) *
          10 ** Math.floor(Math.log10(args[0])) -
        1
  ),

  NINE: new SingleNumSeq("All Nines Sequence", "NINE", "nine(x)", 9),

  NORM: new Func("Generalized Norm", "NORM", "norm(...)", (args) =>
    Math.sqrt(args.reduce((prev, curr) => prev + curr ** 2, 0))
  ),

  NOTS: new Left("Signed Bitwise NOT", "NOTS", "~", (args) => ~args[0]),

  OBLN: new Func(
    "Oblong Numbers",
    "OBLN",
    "O(n)",
    (args) => args[0] ** 2 + args[0]
  ),

  OCTO: new Func(
    "Octagonal Numbers",
    "OCTO",
    "🛑(x)",
    (args) => args[0] * (3 * args[0] - 2)
  ),

  PELL: new Func(
    "Pell Numbers",
    "PELL",
    "P(n)",
    (args) =>
      ((1 + Math.sqrt(2)) ** args[0] + (1 - Math.sqrt(2)) ** args[0]) /
      (2 * Math.sqrt(2))
  ),

  PENT: new Func("Pentatope Numbers", "PENT", "5️⃣(n)", (args) =>
    nCr(args[0] + 3, 4)
  ),

  PICK: new Bin(
    "Permutations",
    "PICK",
    "P",
    (args) => gamma(args[0]) / gamma(args[0] - args[1])
  ),

  ROOK: new Func("Rook Problem", "ROOK", "♟️(n)", function rook(args) {
    return args[0] >= 2
      ? 2 * (rook([args[0] - 1]) + (args[0] - 1) * rook([args[0] - 2]))
      : args[0] + 1;
  }),

  ROOT: new Func(
    "nth Root",
    "ROOT",
    "√(x,y)",
    (args) => args[0] ** (1 / args[1])
  ),

  SECH: new Func(
    "Hyperbolic Secant",
    "SECH",
    "sech(x)",
    (args) => 1 / Math.cosh(args[0])
  ),

  SIGN: new Func("Sign Function", "SIGN", "sgn(x)", Math.sign),

  SINC: new Func(
    "Sinc Function",
    "SINC",
    "sinc(x)",
    (args) => Math.sin(args[0]) / args[0]
  ),

  SINH: new Func("Hyperbolic Sine", "SINH", "sinh(x)", Math.sinh),

  SLOG: new Func("Super-logarithm", "SLOG", "slog(x,y)", function slog(args) {
    return args[1] == 1 ? slog(Math.log(args[1]) / Math.log(args[0])) + 1 : 0;
  }),

  SNFK: new Func(
    "Stirling Numbers of the First Kind",
    "SNFK",
    "S¹(n,m)",
    function snfk(args) {
      if (args[1] >= args[0] || args[1] === 0) return args[0] ^ args[1] ? 0 : 1;
      return (
        (args[0] - 1) * snfk([args[0] - 1, args[1]]) +
        snfk([args[0] - 1, args[1] - 1])
      );
    }
  ),

  SNSK: new Func(
    "Stirling Numbers of the Second Kind",
    "SNSK",
    "S²(n,m)",
    function snsk(args) {
      if (args[1] >= args[0] || args[1] === 0) return args[0] ^ args[1] ? 0 : 1;
      return (
        args[1] * snsk([args[0] - 1, args[1]]) +
        snsk([args[0] - 1, args[1] - 1])
      );
    }
  ),

  SQRT: new Left("Square Root", "SQRT", "√", Math.sqrt),

  SUBF: new Left("Subfactorial", "SUBF", "!", (args) =>
    Math.round(gamma(args[0]) / Math.E)
  ),

  TANH: new Func("Hyperbolic Tangent", "TANH", "tanh(x)", Math.tanh),

  TETR: new Func(
    "Tetrahedral Numbers",
    "TETR",
    "4️⃣(n)",
    (args) => (args[0] * (args[0] + 1) * (args[0] + 2)) / 6
  ),

  TRIF: new Right(
    "Triangular Factorial",
    "TRIF",
    "∆",
    (args) => (gamma(args[0]) * gamma(args[0] - 1)) / 2 ** (args[0] - 1)
  ),

  ZERO: new SingleNumSeq("All Zeros Sequence", "ZERO", "zero(x)", 0),

  ACOSH: new Func("Inverse Hyperbolic Cosine", "ACOSH", "acosh(x)", Math.acosh),

  ACOTH: new Func(
    "Inverse Hyperbolic Tangent",
    "ACOTH",
    "acoth(x)",
    (args) => 0.5 * Math.ln((args[0] + 1) / (args[0] - 1))
  ),

  ACSCH: new Func("Inverse Hyperbolic Cosecant", "ACSCH", "acsch(x)", (args) =>
    Math.ln(1 / args[0] + Math.sqrt(1 / args[0] ** 2 + 1))
  ),

  ASECH: new Func("Inverse Hyperbolic Secant", "ASECH", "asech(x)", (args) =>
    Math.ln(1 / args[0] + Math.sqrt(1 / args[0] ** 2 - 1))
  ),

  ASINH: new Func("Inverse Hyperbolic Sine", "ASINH", "asinh(x)", Math.asinh),

  ATANH: new Func("Inverse Hyperbolic Tanget", "ATANH", "atanh(x)", Math.atanh),

  CPENT: new Func(
    "Centered Pengagonal Numbers",
    "CPENT",
    "cp(n)",
    (args) => (5 * args[0] ** 2 - 5 * args[0] + 2) / 2
  ),

  DFACT: new Func(
    "Factorions",
    "DFACT",
    "D!(n)",
    (args) => [1, 2, 145, 40585][args[0]]
  ),

  EIGHT: new SingleNumSeq("All Eights Sequence", "EIGHT", "eight(x)", 8),

  FLOOR: new Wrap("Floor Function", "FLOOR", "⌊x⌋", Math.floor),

  FRESC: new Func("Fresnel C Integral", "FRESC", "fresC(x)", (args) =>
    integral((t) => Math.cos(t) ** 2, 0, args[0])
  ),

  FRESS: new Func("Fresnel S Integral", "FRESS", "fresS(x)", (args) =>
    integral((t) => Math.sin(t) ** 2, 0, args[0])
  ),

  GAMMA: new Func("Gamma Function", "GAMMA", "Γ(n)", gamma),

  HANOI: new Func("Tower of Hanoi Numbers", "HANOI", "🖐️(n)", (args) =>
    Math.floor((7 * 2 ** (args[0] + 1) - 9 * args[0] - 10) / 3)
  ),

  SEVEN: new SingleNumSeq("All Sevens Sequence", "SEVEN", "seven(x)", 7),

  THREE: new SingleNumSeq("All Threes Sequence", "THREE", "three(x)", 3),

  CHOOSE: new Bin("Combinations", "CHOOSE", "C", (args) =>
    nCr(args[0], args[1])
  ),

  ELEVEN: new SingleNumSeq("All 11 Albanias", "ELEVEN", "🇦🇱(x)", 11),

  TWELVE: new SingleNumSeq("Those 12 bees", "TWELVE", "🐝(x)", 12),
};
// trole !
