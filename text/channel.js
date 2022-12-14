import { EMOJI } from "../utils/constants.js";
import { EventListener, escapeHtml } from "../utils/utils.js";

export const channels = window.channels = {};

export class TextChannel {
  constructor(
    name,
    realName,
    maxMessages,
    maxLength,
    extraData,
    toHTML,
     color = "black"
  ) {
    this.realName = realName;
    this.max = maxMessages; //int
    this.length = maxLength; //int
    this.messages = {
      default: []
    }; //array,string
    this.currentChat = "default"
    this.msgCounter = 0; //int
    this.eventListener = new EventListener();
    this.isFrozen = false; //bool
    this.isVisible = true;
      this.color = color
    // force update
    this.updateText = () => {}; //function
    this.extraData = extraData ?? (() => ({})); //function
    this.toHTML = //function
      toHTML ??
      ((i) => {
        const ele = ce("div");
        const txt = ce("span");
        txt.innerHTML = addEmoji(escapeHtml(i.msg));
        ele.append(txt);
        return ele;
      });
    channels[name] = this;
  }
  changeChannelName(name) {
    this.eventListener.emit("channelName", name);
    this.realName = name;
  }
  switchToChat(name) {
    if (this.messages[name] === undefined) {
      this.messages[name] = []
    }
    this.currentChat = name
    this.eventListener.emit("chatChange", name)
  }
  get currentMessages() {
    return this.messages[this.currentChat]
  }
  deleteMessage(ind) {
    this.currentMessages.splice(ind, 1);
  }
  on(func, type) {
    return this.eventListener.on(func, type);
  }
  unListen() {
    this.handlers = [];
  }
  show() {
    this.isVisible = true;
    this.eventListener.emit("show", true);
  }
  hide() {
    this.isVisible = false;
    this.eventListener.emit("show", false);
  }
  freeze() {
    this.eventListener.emit("freeze", true);
    this.isFrozen = true;
  }
  unFreeze() {
    this.eventListener.emit("freeze", false);
    this.isFrozen = false;
  }
  sendMessage(msg, bot = true) {
    if (this.isFrozen) return;
    if (!bot) this.msgCounter++;
    this.currentMessages.push({
      msg: String(msg),
      num: this.msgCounter,
      bot,
      ...this.extraData(msg),
    });
    this.eventListener.emit("message", msg, bot);
    if (this.currentMessages.length > this.max) {
      this.currentMessages.shift();
    }
    this.updateText();
  }
}

export function ce(n) {
  return document.createElement(n);
}

// WARNING the string needs to be sanatized
export function addEmoji(safeString) {
  for (const emoji of EMOJI) {
    const regex = new RegExp(`:${emoji.name}:`, "g");
    safeString = safeString.replace(regex, `<img src="${emoji.src}" />`);
  }
  return safeString;
}
class TextChannelDisp extends HTMLElement {
  updateText() {
    // oh shoot js injection
    this.texts.innerHTML = "";
    this.textInstance.currentMessages.forEach((i) => {
      const ele = this.textInstance.toHTML(i);
      ele.onmouseover = () => (ele.style.backgroundColor = "grey");
      ele.onmouseout = () => (ele.style.backgroundColor = "inherit");
      if (!i.bot) ele.innerHTML += `<sub>#${i.num}</sub>`;
      this.texts.append(ele);
    });
    if (this.texts.childNodes.length === 0) return;
    [...this.texts.childNodes].at(-1).scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }
  sendText() {
    if (this.input.value === "" || this.tooBig || this.textInstance.isFrozen)
      return;
    //if (this.input.value.length
    this.textInstance.sendMessage(this.input.value, false);
    this.input.value = "";
  }

  get tooBig() {
    return this.input.value.length > this.textInstance.length;
  }
  disconnectedCallback() {
    this.stop.forEach((i) => i());
  }
  connectedCallback() {
    if (!this.isConnected) return;
    this.attachShadow({ mode: "open" });

    this.textInstance = channels[this.getAttribute("name")];

    this.wrapper = ce("div");
    this.titleEle = ce("div");
    this.texts = ce("div");
    this.input = ce("input");
    const btn = ce("button");
    const txtLength = ce("div");

    this.titleEle.style.textAlign = "center";
    this.titleEle.innerHTML = this.textInstance.realName;

    this.input.onkeydown = (e) => {
      if (e.key === "Enter") this.sendText();
    };
    this.input.style.width = "calc(100% -  85px)";
    this.input.type = "text"

    this.stop = [
      this.textInstance.on((d) => {
        this.titleEle.innerHTML = d;
      }, "channelName"),
      this.textInstance.on((f) => {
        this.wrapper.style.display = f ? "block" : "none";
      }, "show"),
      this.textInstance.on(() => this.updateText(), "chatChange")
    ];

    this.textInstance.updateText = () => this.updateText();

    btn.onclick = () => this.sendText();
    btn.innerHTML = "Submit";
    btn.style.width = "75px";

    this.texts.style.overflow = "auto";
    this.texts.style.overflowWrap = "break-word";
    this.texts.style.height = "85vh";

    txtLength.style.textAlign = "right";

    //wrapper.style.textAlign = "right"
    this.wrapper.append(this.titleEle, this.texts, this.input, btn, txtLength);
    this.shadowRoot.append(this.wrapper);
    this.int = setInterval(() => {
      this.input.disabled = this.textInstance.isFrozen;
      btn.disabled = this.tooBig || this.textInstance.isFrozen;
      txtLength.innerHTML = `${
        this.textInstance.length - this.input.value.length
      } chars left`;
      txtLength.style.color = this.tooBig ? "red" : "green";
    }, 10);
    this.updateText();
  }

  disconnectedCallback() {
    clearInterval(this.int);
  }
}

customElements.define("text-box", TextChannelDisp);
