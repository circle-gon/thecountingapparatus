import {ce} from '../text/channel.js'

const modal = document.getElementById("modal")
const content = document.getElementById("content")
const close = document.getElementById("close")

const exampleModals = {
  challengeSelector(factionInstance) {
    const div = ce("div")
    const btn = ce("button")
    const challStuffs = ce("div")
    
    factionInstance.challengeDetails.forEach(i => {
      const selection = ce("div")
      selection.innerHTML = `<input type="checkbox"
      id="check${int}" 
      class="control"
      checked />
    <label for="check${int}" title="${this.textGroup.name}" class="label">${this.textGroup.name}</label>`
    })
    
    btn.classList.add("fancy-btn")
    btn.onclick = hideModal
    btn.innerHTML = "Okay."
    
    text.innerHTML = "Some text"
    div.append(text, btn)
    
    div.classList.add("columns")
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