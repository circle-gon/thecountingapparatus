import { EMOJI } from "../utils/constants.js";
import { EventListener } from "../utils/utils.js";

const channels = {};

export class TextChannel {
  constructor(
    name,
    realName,
    maxMessages,
    maxLength,
    extraData,
    toHTML,
    inType
  ) {
    this.realName = realName;
    this.max = maxMessages; //int
    this.length = maxLength; //int
    this.messages = []; //array,string
    this.inputType = inType ?? "text"; //string
    this.msgCounter = 0; //int
    this.eventListener = new EventListener();
    this.isFrozen = false; //bool
    this.isVisible = true;
    // force update
    this.updateText = () => {}; //function
    this.extraData = extraData ?? (() => ({})); //function
    this.toHTML = //function
      toHTML ??
      ((i) => {
        const ele = ce("div");
        const txt = ce("span");
        txt.innerText = i.msg;
        ele.append(txt);
        return ele;
      });
    channels[name] = this;
  }
  changeChannelName(name) {
    this.eventListener.emit("channelName", name);
    this.realName = name;
  }
  deleteMessage(ind) {
    this.messages.splice(ind, 1);
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
    this.eventListner.emit("freeze", true);
    this.isFrozen = true;
  }
  unFreeze() {
    this.eventListener.emit("freeze", false);
    this.isFrozen = false;
  }
  sendMessage(msg, bot = true) {
    if (this.isFrozen) return;
    if (!bot) this.msgCounter++;
    this.messages.push({
      msg,
      num: this.msgCounter,
      bot,
      ...this.extraData(msg),
    });
    this.eventListener.emit("message", msg);
    if (this.messages.length > this.max) {
      this.messages.shift();
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
    safeString = safeString.replace(regex, emoji.src);
  }
  return safeString;
}
class TextChannelDisp extends HTMLElement {
  updateText() {
    // oh shoot js injection
    this.texts.innerHTML = "";
    this.textInstance.messages.forEach((i) => {
      const ele = this.textInstance.toHTML(i);
      ele.onmouseover = () => (ele.style.backgroundColor = "grey");
      ele.onmouseout = () => (ele.style.backgroundColor = "inherit");
      if (!i.bot) ele.innerHTML += `<sub>#${i.num}</sub>`;
      this.texts.append(ele);
    });
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
  connectedCallback() {
    if (!this.isConnected) return;
    this.attachShadow({ mode: "open" });
    // console.log(this.getAttribute("name"), channels.Chat, this.textInstance);

    this.textInstance = channels[this.getAttribute("name")];

    this.wrapper = ce("div");
    this.titleEle = ce("div");
    this.texts = ce("div");
    this.input = ce("input");
    const btn = ce("button");
    const txtLength = ce("div");

    this.titleEle.textAlign = "center";
    this.titleEle.innerHTML = this.textInstance.realName;

    this.input.onkeydown = (e) => {
      if (e.key === "Enter") this.sendText();
    };
    this.input.style.width = "calc(100% -  85px)";
    this.input.type = this.textInstance.inputType;

    this.textInstance.on((d) => {
      this.titleEle.innerHTML = d;
    }, "channelName");
    this.textInstance.on((f) => {
      this.wrapper.style.display = f ? "block" : "none";
    }, "show");

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
    this.updateText()
  }

  disconnectedCallback() {
    clearInterval(this.int);
  }
}

//console.log("ping", channels);
/*const txt = new TextChannel("Chat", 10)
txt.onMessage(i=> {
  if (i === "gwa") {
    txt.sendMessage("This channel is locked!")
    txt.freeze()
    setTimeout(() => {
      txt.sendMessage("You got trolled, it is unfrozen :trol:")
      txt.unFreeze()
    }, 10000*Math.random())
  }
})*/
customElements.define("text-box", TextChannelDisp);
