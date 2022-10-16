import {ce} from './channel.js'

const textGroups = {}

class TextGroup {
  // channels is a array of arguments which either is:
  // string: pointing to a TextChannel instance
  // TextChannel: a TextChannel instance
  constructor(name, displayName, ...channels) {
    this.isVisible = true
    this.name = displayName
    this.channels = channels
    textGroups[name] = this
    
  }
}

class TextGroupDisplay extends HTMLElement {
  connectedCallback() {
    if (!this.isConnected) return
    this.attachShadow({mode: "open"})
    const name = this.getAttribute("name")
    this.textGroup = textGroups[name]
    const wrapper = ce("div")
    const title = ce("div")
    const channels = ce("ul")
    const style = ce("style")
    title.innerHTML = this.textGroup.name
    channels.innerHTML = this.textGroup.channels.map(i=>`<li>${i}</li>`).join("")
    style.innerHTML = `
    ul {
      /* don't ask why */
      list-style-type: disc;
    }
    `
    wrapper.append(title, channels)
    this.shadowRoot.append(wrapper, style)
  }
}

const TEST_TEST_GROUP = new TextGroup("example", "Example TextGroup", 1, 2, 3)
console.log("testing")
customElements.define("text-group", TextGroupDisplay)