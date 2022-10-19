import {ce} from '../text/channel.js'

const modal = document.getElementById("modal")
const content = document.getElementById("content")
const close = document.getElementById("close")

const exampleModals = {
  challengeSelector(factionInstance) {
    const div = ce("div")
    const btn = ce("button")
    
    btn.classList.add("fancy-btn")
    btn.onclick = hideModal
    btn.innerHTML = "Okay."
    
    div.innerHTML = "Some text"
    div.append(ce("br"), btn)
    return div
  }
}

close.onclick = function () {
  hideModal()
}
export function showModal(i, ...args) {
  modal.style.display = "block"
  
  // TODO: better method?
  content.innerHTML = ""
  const mod = exampleModals[i]
  const result = typeof mod === 'string' ? mod : mod(...args)
  if (typeof result === 'string') {
    content.innerHTML = result
  } else if (Array.isArray(result)) {
    content.append(...result)
  } else {
    content.append(result)
  }
}

export function hideModal() {
  modal.style.display = "none"
}

window.showModal = showModal