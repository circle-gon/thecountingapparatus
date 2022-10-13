//Function Objects
export const Functions = {}

export class FunctionBase {
  constructor (name, unlock, syntax, evaluate){
    this.name = name;            // Name of function
    this.unlock = unlock;        // Letter unlock string
    this.syntax = syntax;        // In-text Syntax
    this.evaluate = evaluate;    // Function definition
    this.counter = {             // Total count of function per function based faction
      xx: 0,
      ones: 0,
      factorial: 0
    };
    this.banCounter = {          // Total count of ban forgiveness usages per function
      xx: 0,
      ones: 0,
      factorial: 0
    };
    this.isBanned = false;
    this.isUnlocked = false;    
    /*this.isStunned = false;*/
  }

  validate(){
    // tentative function validation
    return this.semantics(arguments)
  }
  
  increment(){
    
  }
}

export function integral(integrand, a, b) {
  var points = [
        [0.2025782419255613, 0.0],
        [0.1984314853271116, -0.2011940939974345],
        [0.1984314853271116, 0.2011940939974345],
        [0.1861610000155622, -0.3941513470775634],
        [0.1861610000155622, 0.3941513470775634],
        [0.1662692058169939, -0.5709721726085388],
        [0.1662692058169939, 0.5709721726085388],
        [0.1395706779261543, -0.7244177313601701],
        [0.1395706779261543, 0.7244177313601701],
        [0.1071592204671719, -0.8482065834104272],
        [0.1071592204671719, 0.8482065834104272],
        [0.0703660474881081, -0.937273392400706],
        [0.0703660474881081, 0.937273392400706],
        [0.0307532419961173, -0.9879925180204854],
        [0.0307532419961173, 0.9879925180204854]];
  var output = 0;
    function f(x) {
      if (a === -Infinity) {
        integrand = (x) => -integrand(x); a=b; b=Infinity;
      }
      if (b === Infinity) {
        integrand = (x) => integrand(1/x - 1) / x**2; a=0; b=1
          //Int(f(x),0,infty) = Int(f(1/x - 1) / x^2,0,1)
      }
      return (integrand((x * (b - a)) / 2 + (a + b) / 2) * (b - a)) / 2;
    }
    for (var i = 0; i < points.length; i++) {
      output += points[i][0] * f(points[i][1]);
    }
    return output;
    //15 point gaussian quadrature
}