import {ce} from './channel.js'

let currTab

export function switchTab(tab) {
  console.log("switch!")
  currTab = tab
}

class TabsMain extends HTMLElement {
  connectedCallback() {
    if (!this.isConnected) return
    this.attachShadow({mode: "open"})
    // this should accept multiple TabGroups, and show 1 chat
    let lastTab;
    const list = this.getAttribute("tabs").split(",")
    const wrapper = ce("div")
    const selection = ce("div")
    let main = ce("faction-disp")
    main.setAttribute("name", "Classic")
    list.forEach(i => {
      const group = ce("text-group")
      group.setAttribute("name", i)
      selection.append(group)
    })
    setInterval(() => {
      if (currTab !== lastTab) {
        main.remove()
        main = ce("faction-disp")
        main.setAttribute("name", currTab)
        wrapper.append(main)
      }
      lastTab = currTab
    }, 50)
    
    wrapper.append(selection, main)
    wrapper.style.display = "grid"
    wrapper.style.gridTemplateColumns = "20% 80%"
    this.shadowRoot.append(wrapper)
  }
}

customElements.define("tabs-main", TabsMain)