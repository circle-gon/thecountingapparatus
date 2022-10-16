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
    const style = ce("link")
    // THIS IS TESTING NOT THE FINAL PRODUCT
    wrapper.innerHTML = `
      <div class="container">
        <input type="checkbox"
           id="check" 
           class="control">
        <label for="check"
           class="label">Click to</label>
        <div class="content">
          This is collapsible content
        </div>
      </div>
    `
    style.rel = "stylesheet"
    style.href = "group-style.css"
    this.shadowRoot.append(wrapper, style)
  }
}

const TEST_TEST_GROUP = new TextGroup("example", "Example TextGroup", 1, 2, 3)
customElements.define("text-group", TextGroupDisplay)