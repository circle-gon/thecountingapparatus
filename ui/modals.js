import {ce} from '../text/channel.js'

const modal = document.getElementById("modal")
const content = document.getElementById("content")
const close = document.getElementById("close")

const exampleModals = {
  challengeSelector(factionInstance) {
    const 
  }
}

close.onclick = function () {
  hideModal()
}
export function showModal(i, ...args) {
  modal.style.display = "block"
  const mod = exampleModals[i]
  const result = typeof mod === 'string' ? mod : mod(...args)
  if (t)
}

export function hideModal() {
  modal.style.display = "none"
}

window.showModal = showModal