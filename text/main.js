import { ce } from "./channel.js";
import { textGroups } from "./groups.js";

let currTab;
let type;

export function switchTab(tab, newType) {
  currTab = tab;
  type = newType;
}

class TabsMain extends HTMLElement {
  disconnectedCallback() {
    this.stop.forEach(i=>clearInterval(i))
  }
  connectedCallback() {
    if (!this.isConnected) return;
    this.attachShadow({ mode: "open" });
    // this should accept multiple TabGroups, and show 1 chat
    let lastTab;
    const list = this.getAttribute("tabs").split(",");
    const wrapper = ce("div");
    const selection = ce("div");
    let main = ce("faction-disp");
    main.setAttribute("name", "Classic");
    list.forEach((i) => {
      const group = ce("text-group");
      group.setAttribute("name", i);
      selection.append(group);
    });
    this.stop = [setInterval(() => {
      if (currTab !== lastTab) {
        main.remove();
        main = ce(type === "faction" ? "faction-disp" : "text-box");
        main.setAttribute("name", currTab);
        wrapper.append(main);
      }
      lastTab = currTab;
    }, 50)]

    selection.style.border = "1px solid grey";
    selection.style.height = "100%";
    wrapper.append(selection, main);
    wrapper.style.display = "grid";
    wrapper.style.gridTemplateColumns = "20% 80%";
    this.shadowRoot.append(wrapper);
  }
}

customElements.define("tabs-main", TabsMain);
