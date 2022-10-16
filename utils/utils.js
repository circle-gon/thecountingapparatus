export function escapeHtml(unsafe) {
  return unsafe
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function randomNumber(start, stop) {
  return start + Math.random()*(stop-start)
}
export function randomColor() {
  let colorStr = "#"
  for (let i=0;i<6;i++) {
     colorStr += Math.floor(randomNumber(0, 17)).toString(16).toUpperCase()
  }
  return colorStr
}
let int = 0
export function randomInt() {
  return int++
}

export function gamma(z) {
  const g = 7;
  const C = [
    0.99999999999980993,
    676.5203681218851,
    -1259.1392167224028,
    771.32342877765313,
    -176.61502916214059,
    12.507343278686905,
    -0.13857109526572012,
    9.9843695780195716e-6,
    1.5056327351493116e-7
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
export class EventListener {
  constructor() {
    this.handlers = new Set()
  }
  
  on(handler, type) {
    const data = {
      handler, 
      type
    }
    this.handlers.add(data)
    return () => this.handlers.delete(data)
  }
  
  emit(type, data) {
    this.handlers.forEach(i => {
      if (i.type === type) {
        i.handler(data)
      }
    })
  }
}