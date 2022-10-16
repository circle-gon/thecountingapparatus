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
    <input type="checkbox"
           id="accordion-1" 
           class="accordion-control">
    <label for="accordion-1"
           class="accordion-label">Click to</label>
    <div class="accordion-content">
      This is collapsible content
    </div>
</div>
    `
    style.innerHTML = `
.accordion-label {
  cursor: pointer;
  display: block;
  user-select: none;
  color: #fff;
}

.container {
  background: #861c7e;
  padding: 20px;
  width: fit-content;
  border-radius: 20px;
}

.accordion-content {
  /* Height animation:
  only really works well if the height is close to content - too high and the animation still goes to the max-height number, messing up the timing
  For widely variable height content, best not to animate. Switch display attribute instead */
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
.accordion-control + label {
  position: relative;
  height: 40px;
  margin-left: 20px;
  padding-left: 5px;
  display: block;
  font-family: arial;
  font-size: 1em;
  line-height: 1em;
  z-index: 0;
}
.accordion-control + label:before, .accordion-control + label:after {
  content: "";
  position: absolute;
}
.accordion-control + label:before {
  left: -19px;
  top: 3px;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 10px 0 10px 16px;
  border-color: transparent transparent transparent #fff;
  transition: all 0.2s ease-in;
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