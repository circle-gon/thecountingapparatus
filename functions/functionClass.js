//Function Objects
export const Functions = {};
export const Operators = {};

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
    this.isUnlocked = false;
    /*this.isStunned = false;*/
  }
}

export function integral(integrand, a, b) {
  const points = [[0.2491470458134028, -0.1252334085114689],
    [0.2491470458134028, 0.1252334085114689],
    [0.2334925365383548, -0.3678314989981802],
    [0.2334925365383548, 0.3678314989981802],
    [0.2031674267230659, -0.5873179542866175],
    [0.2031674267230659, 0.5873179542866175],
    [0.1600783285433462, -0.7699026741943047],
    [0.1600783285433462, 0.7699026741943047],
    [0.1069393259953184, -0.9041172563704749],
    [0.1069393259953184, 0.9041172563704749],
    [0.0471753363865118, -0.9815606342467192],
    [0.0471753363865118, 0.9815606342467192]];
  const output = 0;
  function f(x) {
    var output = x => 0;
    if (a === -Infinity) {
      output = x => output(x) + integrand(-1/x - 1) / (x**2);
      a=0; b=1;
    }
    if (b === Infinity) {
      output = x => output(x) + integrand(1/x - 1) / (x**2);
      a=0; b=1;
    }
    if (a !== -Infinity && b !== Infinity) {
      output = x => integrand(x)
    }
    return (output((x * (b - a)) / 2 + (a + b) / 2) * (b - a)) / 2;
  }
  for (var i = 0; i < points.length; i++) {
    output += points[i][0] * f(points[i][1]);
  }
  return output;
  //12 point gaussian quadrature
}
