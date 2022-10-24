import { ce } from "../text/channel.js";
import { randomInt } from "../utils/utils.js";

const modal = document.getElementById("modal");
const content = document.getElementById("content");
const close = document.getElementById("close");

const exampleModals = {
};

close.onclick = function () {
  hideModal();
};
export function showModal(i, ...args) {
  modal.style.display = "block";

  // TODO: better method?
  content.innerHTML = "";
  const mod = exampleModals[i];
  const result = typeof mod === "string" ? mod : mod(...args);
  if (typeof result === "string") {
    content.innerHTML = result;
  } else if (Array.isArray(result)) {
    content.append(...result);
  } else {
    content.append(result);
  }
}

export function hideModal() {
  modal.style.display = "none";
}

window.showModal = showModal;
