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
    title.innerHTML = `
      <input type="radio" class="control" />
      <div class="title">${this.textGroup.name}</div>
    `
    channels.innerHTML = this.textGroup.channels.map(i=>`<li>${i}</li>`).join("")
    channels.classList.add("content")
    style.innerHTML = `
    ul {
      /* don't ask why */
      list-style-type: disc;
    }
    .title {
      cursor: pointer;
      user-select: none;
      color: #ffffff;
    }
    .title:before {
      left: -19px;
      top: 3px;
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 10px 0 10px 16px;
      border-color: transparent transparent transparent #fff;
      transition: all 0.2s ease-in;
    }
    .content {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.2s;
      background-size: 260px;
      background-repeat: no-repeat;
      background-position: center;
      color: #fff;
    }
    .control {
      display: none;
    }
    .control:checked + title.after {
      content: attr(data-label-open)
    }
    .control:checked + title:before {
      transform: rotate(90deg);
    }
    .control + title.after {
      content: attr(data-label-closed);
      padding-left: 4px;
    }
    `
    wrapper.append(title, channels)
    this.shadowRoot.append(wrapper, style)
  }
}

const TEST_TEST_GROUP = new TextGroup("example", "Example TextGroup", 1, 2, 3)
console.log("testing")
customElements.define("text-group", TextGroupDisplay)