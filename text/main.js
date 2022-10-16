import {ce} from './channel.js'

let currTab = ""

export function switchTab(tab) {
  currTab = tab
}

class TabsMain extends HTMLElement {
  connectedCallback() {
    if (!this.isConnected) return
    this.attachShadow({mode: "open"})
    // this should accept multiple TabGroups, and show 1 chat
    
    const list = this.getAttribute("tabs").split(",")
    const wrapper = ce("div")
    const selection = ce("div")
    const main = ce("div")
    
    wrapper.append(selection, main)
    wrapper.style.display = "grid"
    wrapper.style.gridTemplateColumns = "20% 80%"
    this.shadowRoot.append(wrapper)
  }
}

customElements.define("tabs", TabsMain)