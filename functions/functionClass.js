//Function Objects
export const Functions = {};
export const Operators = {};
export const Left = {};
export const Right = {};
export const Wrap = {};
export const Bin = {};

export class FunctionBase {
  constructor(name, unlock, syntax, evaluate) {
    this.name = name; // Name of function
    this.unlock = unlock; // Letter unlock string
    this.syntax = syntax; // In-text Syntax
    this.evaluate = evaluate; // Function definition
    this.counter = {
      // Total count of function per function based faction
      xx: 0,
      ones: 0,
      factorial: 0,
    };
    this.banCounter = {
      // Total count of ban forgiveness usages per function
      xx: 0,
      ones: 0,
      factorial: 0,
    };
    this.isBanned = false;
    this.isUnlocked = true;
    this.isStunned = false;
  }
}

const points = [[0.1527533871307258,	-0.0765265211334973],
[0.1527533871307258,	0.0765265211334973],
[0.1491729864726037,	-0.2277858511416451],
[0.1491729864726037,	0.2277858511416451],
[0.1420961093183820,	-0.3737060887154195],
[0.1420961093183820,	0.3737060887154195],
[0.1316886384491766,	-0.5108670019508271],
[0.1316886384491766,	0.5108670019508271],
[0.1181945319615184,	-0.6360536807265150],
[0.1181945319615184,	0.6360536807265150],
[0.1019301198172404,	-0.7463319064601508],
[0.1019301198172404,	0.7463319064601508],
[0.0832767415767048,	-0.8391169718222188],
[0.0832767415767048,	0.8391169718222188],
[0.0626720483341091,	-0.9122344282513259],
[0.0626720483341091,	0.9122344282513259],
[0.0406014298003869,	-0.9639719272779138],
[0.0406014298003869,	0.9639719272779138],
[0.0176140071391521,	-0.9931285991850949],
[0.0176140071391521,	0.9931285991850949]]

export function integral(integrand, a, b) {
  let outf;
  let conversion = (f,x,b,a) => (f((x * (b - a)) / 2 + (a + b) / 2) * (b - a)) / 2;
  if (a === -Infinity && b === Infinity) {
    outf = x => (conversion(x => (integrand(1/x - 1) + integrand(-1/x - 1)) / (x**2), x, 0, 1));
  } else if (a === -Infinity) {
      outf = x => (conversion(x => integrand(-1/x - 1) / (x**2), x, 0, 1) + conversion(integrand, x, 0, b));
  } else if (b === Infinity){
      outf = x => (conversion(x => integrand(1/x - 1) / (x**2), x, 0, 1) + conversion(integrand, x, a, 0));
  } else {
      outf = x => conversion(integrand,x,a,b);
  }
  // linear for clarity
  
  let output = 0;
  for (let i = 0; i < points.length; i++) {
    output += points[i][0] * outf(points[i][1]);
  }
  return output;
  
  //20 point gaussian quadrature
  //Doesnt work with improper integrals for some reason
}
