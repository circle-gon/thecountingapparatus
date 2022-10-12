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