import {ce} from './channel.js'
import {randomInt} from '../utils/utils.js'

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
    const type = this.getAttribute("type") ?? "faction"
    this.textGroup = textGroups[name]
    const wrapper = ce("div")
    const style = ce("link")
    const selection = ce("div")
    const names = ce("div")
    const channelDisp = ce(type === "faction" ? "faction-disp" : "text-box")
    const int = randomInt()
    const realText = this.textGroup.name.length > 24 ? this.textGroup.name.substring(0, 24) + "..." : this.textGroup.name
    // THIS IS TESTING NOT THE FINAL PRODUCT
    selection.innerHTML = `
    <input type="checkbox"
      id="check${int}" 
      class="control">
    <label for="check${int}" title="${this.textGroup.name}" class="label">${realText}</label>
    `
    selection.classList.add("container")
    names.classList.add("content")
    this.textGroup.channels.forEach(i => {
      const ele = ce("div")
      ele.classList.add("channel")
      ele.innerHTML = i
      ele.onclick = () => {
        console.log("change!")
        channelDisp.setAttribute("name", i);
      }
      console.log(selection.childNodes);
      names.append(ele)
    })
    channelDisp.setAttribute("name", "Classic")
    style.rel = "stylesheet"
    style.href = "group-style.css"
    wrapper.style.display = "grid"
    wrapper.style.gridTemplateColumns = "20% 80%";
    
    selection.append(names)
    wrapper.append(selection, channelDisp)
    this.shadowRoot.append(wrapper, style)
  }
}

const TEST_TEST_GROUP = new TextGroup("example", "Example TextGroup testing testing", 1, 2, 3)
customElements.define("text-group", TextGroupDisplay)