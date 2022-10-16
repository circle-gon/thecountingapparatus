const textGroups = []

class TextGroup {
  // channels is a array of arguments which either is:
  // string: pointing to a TextChannel instance
  // TextChannel: a TextChannel instance
  constructor(name, ...channels) {
    this.isVisible = true
    this.textGroups[name] (this)
    
  }
}

class TextGroupDisplay extends HTMLElement {
  connectedCallback() {
    
  }
}

customElements.define("text-group", TextGroupDisplay)