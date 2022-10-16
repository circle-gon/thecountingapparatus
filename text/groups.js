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
    const style = ce("style")
    // THIS IS TESTING NOT THE FINAL PRODUCT
    wrapper.innerHTML = `
      <div class="container">
  <div class="accordion_container">
    <input type="checkbox"
           id="accordion-1" 
           class="accordion-control">
    <label for="accordion-1"
           class="accordion-label" 
           data-label-closed="show" 
           data-label-open="hide">Click to</label>
    <div class="accordion-content">
      This is collapsible content
    </div>
  </div>
</div>
    `
    style.innerHTML = `
    .accordion_container {
  background: #861c7e;
  padding: 20px;
  border-bottom: 1px solid #fff;
  max-width: 720px;
  margin: 0 auto;
}
.accordion_container:first-of-type {
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
}
.accordion_container:last-of-type {
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  border-bottom: none;
}
    .accordion-label {
  cursor: pointer;
  display: block;
    user-select: none;
    color: #fff;
}
.accordion-content {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.2s;
  background-size: 260px;
  background-repeat: no-repeat;
  background-position: center;
  color: #fff;
}
.accordion-control {
  display: none;
}
.accordion-control + label:before {
  position: relative;
  left: -19px;
  top: 3px;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 10px 0 10px 16px;
  border-color: transparent transparent transparent #fff;
  transition: all 0.2s ease-in;
}
.accordion-control:checked + label:after {
  content: attr(data-label-open);
}
.accordion-control + label:after {
  content: attr(data-label-closed);
  padding-left: 4px;
}
.accordion-control:checked + label:before {
  transform: rotate(90deg);
}
.accordion-control:checked + label + .accordion-content {
  max-height: 350px;
}

    `
    this.shadowRoot.append(wrapper, style)
  }
}

const TEST_TEST_GROUP = new TextGroup("example", "Example TextGroup", 1, 2, 3)
customElements.define("text-group", TextGroupDisplay)