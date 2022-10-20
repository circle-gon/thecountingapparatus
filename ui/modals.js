import { ce } from "../text/channel.js";
import { randomInt } from "../utils/utils.js";

const modal = document.getElementById("modal");
const content = document.getElementById("content");
const close = document.getElementById("close");

const exampleModals = {
  challengeSelector(factionInstance) {
    function realClose() {
      toPause.forEach(i=>clearInterval())
    }
    
    const toPause = []
    const div = ce("div");
    const buttonCollection = ce("div");
    const btn = ce("button");
    const cancelBtn = ce("button");
    const challStuffs = ce("div");
    const count = ce("span");
    const currChallenge = ce("span");
    const chalSelectedText = ce("div");
    const challengeInt = randomInt();

    let challSelected;

    challStuffs.append(chalSelectedText);

    factionInstance.challengeDetails.forEach((i, ind) => {
      const selection = ce("div");
      const content = ce("div");
      const int = randomInt();

      selection.innerHTML = `<input type="checkbox"
        id="check${int}" 
        class="control" />
      <label for="check${int}" title="${i.title}" class="label">
        <div style="display: flex; align-items: center; justify-content: space-between;">
          ${i.title}
          <input type="radio" name="challSelect${challengeInt}" value="${ind}" />
        </div>
      </label>`;

      content.innerHTML = `
        <div>${i.description}</div>
        Best count in this challenge: 
      `;
      count.innerText = factionInstance.challenges[ind];

      content.append(count);
      content.classList.add("content");

      const radio = selection.querySelector('input[type="radio"]');
      radio.addEventListener("change", function () {
        challSelected = Number(this.value);
        chalSelectedText.innerHTML = `Challenge selected: ${factionInstance.challengeDetails[challSelected].title}`;
        btn.disabled = false
      });
      selection.classList.add("container");
      selection.style.display = factionInstance.challengeDetails[ind].unlocked()
      selection.append(content);
      challStuffs.append(selection);
      toPause.push(setInterval(() => {
        selection.style.display = factionInstance.challengeDetails[ind].unlocked()
      }, 50))
    });

    btn.classList.add("fancy-btn");
    btn.onclick = function () {
      if (challSelected !== undefined) {
        factionInstance.enterChallenge(challSelected);
      } else {
        factionInstance.exitChallenge();
      }
      hideModal();
    };
    btn.innerHTML = factionInstance.inChallenge !== null ? "Exit Challenge" : "Do this challenge!";
    btn.disabled = factionInstance.inChallenge === null;

    cancelBtn.classList.add("fancy-btn");
    cancelBtn.onclick = hideModal;
    cancelBtn.innerHTML = "Go back to normal counting :(";
    cancelBtn.style.marginLeft = "20px";

    chalSelectedText.innerHTML =
      factionInstance.inChallenge !== null
        ? `Clicking the submit button will exit your current challenge. (you are in challenge ${
            factionInstance.challengeDetails[factionInstance.inChallenge].title
          })`
        : "You have not selected a challenge!";

    buttonCollection.append(btn, cancelBtn);

    div.append(challStuffs, buttonCollection);
    return div;
  },
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
