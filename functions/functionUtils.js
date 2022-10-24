import { gamma } from "../utils/utils.js"

export function integral(integrand, a, b) {
  const points = [
    [0.1527533871307258, -0.0765265211334973],
    [0.1527533871307258, 0.0765265211334973],
    [0.1491729864726037, -0.2277858511416451],
    [0.1491729864726037, 0.2277858511416451],
    [0.142096109318382, -0.3737060887154195],
    [0.142096109318382, 0.3737060887154195],
    [0.1316886384491766, -0.5108670019508271],
    [0.1316886384491766, 0.5108670019508271],
    [0.1181945319615184, -0.636053680726515],
    [0.1181945319615184, 0.636053680726515],
    [0.1019301198172404, -0.7463319064601508],
    [0.1019301198172404, 0.7463319064601508],
    [0.0832767415767048, -0.8391169718222188],
    [0.0832767415767048, 0.8391169718222188],
    [0.0626720483341091, -0.9122344282513259],
    [0.0626720483341091, 0.9122344282513259],
    [0.0406014298003869, -0.9639719272779138],
    [0.0406014298003869, 0.9639719272779138],
    [0.0176140071391521, -0.9931285991850949],
    [0.0176140071391521, 0.9931285991850949],
  ];
  let outf;
  const conversion = (f, x, a, b) =>
    (f((x * (b - a)) / 2 + (a + b) / 2) * (b - a)) / 2;
  if (a === -Infinity || b === Infinity) {
    throw "Improper Integrals are not supported.";
  }
  outf = (x) => conversion(integrand, x, a, b);

  let output = 0;
  for (const point of points) {
    output += point[0] * outf(point[1]);
  }
  return output;

  // 20 point gaussian quadrature
  // Do not use with Improper Integrals
}

export function ladd(args) {
  let output = "";
  args[0] = args[0].toString();
  args[1] = args[1].toString();
  let max = Math.max(args[0].length, args[1].length);
  args[0] = "0".repeat(max - args[0].length) + args[0];
  args[1] = "0".repeat(max - args[1].length) + args[1];
  for (let i = 1; i <= max; i++) {
    output =
      Math.max(
        parseInt(args[0].at(args[0].length - i)),
        parseInt(args[1].at(args[1].length - i))
      ).toString() + output;
  }
  return output;
}

export function prime(x) {
  // the inefficient way
  // warning this is very inefficent
  // ~ O(4^x)
  let p = 1;
  for (let i = 1; i <= 2 ** x; i++) {
    let s = 0;
    for (let j = 1; j <= i; j++) {
      s += Math.floor(Math.cos((Math.PI * (1 + gamma(j))) / j) ** 2);
    }
    p += Math.floor((x / s) ** (1 / x));
  }
  return p;
}

export function nCr(x, y) {
  return gamma(x + 1) / (gamma(y + 1) * gamma(x - y + 1));
}