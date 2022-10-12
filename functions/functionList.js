import {Function} from './functionClass.js';
import {gamma} from './factorial.js';

//Subclasses
  class NChooseR extends Function {
    constructor (name, unlock, syntax, input1, input2){
      super(name, unlock, syntax, gamma(input1+1)/(gamma(input2+1)*gamma(input1-input2+1))); //n!/ (r! (n−r)!)
    }
  }

  class Logarithm extends Function {
    constructor (name, unlock, syntax, base, input){
      super(name, unlock, syntax, Math.log(input)/Math.log(base));
    }
  }
//Functions (organize by unlock)
  