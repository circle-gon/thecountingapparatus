import {ce, TextChannel, channels} from './channel.js'
import {randomInt} from '../utils/utils.js'
import {switchTab} from './main.js'

export const textGroups = {}

class TextGroup {
  // channels is a array of arguments which either is:
  // string: pointing to a TextChannel instance
  // TextChannel: a TextChannel instance
  constructor(name, displayName, type, ...channels) {
    this.isVisible = true
    this.name = displayName
    this._name = name
    this.type = type
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
    const style = ce("link")
    const names = ce("div")
    // fix assumption later
    const int = randomInt()
    // TODO: better method than this
    // THIS IS TESTING NOT THE FINAL PRODUCT
    wrapper.innerHTML = `
    <input type="checkbox"
      id="check${int}" 
      class="control"
      checked />
    <label for="check${int}" title="${this.textGroup.name}" class="label">${this.textGroup.name}</label>
    `
    wrapper.classList.add("container")
    names.classList.add("content")
    this.textGroup.channels.forEach((i) => {
      const ele = ce("div")
      ele.classList.add("channel")
      ele.innerHTML = channels[i].realName
      ele.onclick = () => {
        switchTab(i, this.textGroup.type)
      }
      names.append(ele)
    })
    style.rel = "stylesheet"
    style.href = "group-style.css"
    wrapper.append(names)
    this.shadowRoot.append(wrapper, style)
  }
}

new TextGroup("faction", "Factions", "faction", "Classic", "Tree", "Letter", "X X", "Ones", "Factorial")

// internalName, realName, maxMessages, maxLimit
new TextChannel("chat", "Chat", 100, 100)

// internalName, displayName, type, channel internal names
new TextGroup("chat", "Chat", "text", "chat")
customElements.define("text-group", TextGroupDisplay)