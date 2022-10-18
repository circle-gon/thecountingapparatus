export function escapeHtml(unsafe) {
  console.log(unsafe, typeof unsafe);
  return unsafe
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function randomNumber(start, stop) {
  return start + Math.random() * (stop - start);
}
export function randomColor() {
  let colorStr = "#";
  for (let i = 0; i < 6; i++) {
    colorStr += Math.floor(randomNumber(0, 17)).toString(16).toUpperCase();
  }
  return colorStr;
}
let int = 0;
export function randomInt() {
  return int++;
}

export function gamma(z) {
  const g = 7;
  const C = [
    0.99999999999980993, 676.5203681218851, -1259.1392167224028,
    771.32342877765313, -176.61502916214059, 12.507343278686905,
    -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7,
  ];

  if (z < 0.5) return Math.PI / (Math.sin(Math.PI * z) * gamma(1 - z));
  else {
    z -= 1;

    let x = C[0];
    for (let i = 1; i < g + 2; i++) x += C[i] / (z + i);

    const t = z + g + 0.5;
    return Math.sqrt(2 * Math.PI) * Math.pow(t, z + 0.5) * Math.exp(-t) * x;
  }
}

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

export class EventListener {
  constructor() {
    this.handlers = new Set();
  }

  on(handler, type) {
    const data = {
      handler,
      type,
    };
    this.handlers.add(data);
    return () => this.handlers.delete(data);
  }

  emit(type, ...data) {
    this.handlers.forEach((i) => {
      if (i.type === type) {
        i.handler(...data);
      }
    });
  }
}
