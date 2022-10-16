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