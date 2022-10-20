import { ce } from "../text/channel.js";
import { randomInt } from "../utils/utils.js";

const modal = document.getElementById("modal");
const content = document.getElementById("content");
const close = document.getElementById("close");

const exampleModals = {
  challengeSelector(factionInstance) {
    function realClose() {
      toPause.forEach(i=>clearInterval(i))
      hideModal()
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
      const label = ce("label")
      const div = ce("div")
      const input = ce("input")
      const int = randomInt();
      
      label.for = `check${int}`
      label.title = i.title
      label.classList.add("label")
      
      div.style.display = "flex"
      div.style.alignItems = "center"
      div.style.justifyContent = "space-between"
      
      input.type = "radio"
      

      selection.innerHTML = `
      <input type="checkbox" id="check${int}" class="control" /> 
      <label for="check${int}" title="${i.title}" class="label">
        <div style="display: flex; align-items: center; justify-content: space-between;">
          ${i.title}
          <input type="radio" name="challSelect${challengeInt}" value="${ind}" />
        </div>
      </label>`;
      // good idea?
      const input = selection.getElementById(`challSelect${challengeInt}`)

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
      input.disabled = !factionInstance.challengeDetails[ind].unlocked()
      selection.append(content);
      challStuffs.append(selection);
      toPause.push(setInterval(() => {
        console.log(!factionInstance.challengeDetails[ind].unlocked())
        input.disabled = !factionInstance.challengeDetails[ind].unlocked()
        count.innerText = factionInstance.challenges[ind]
      }, 50))
    });

    btn.classList.add("fancy-btn");
    btn.onclick = function () {
      if (challSelected !== undefined) {
        factionInstance.enterChallenge(challSelected);
      } else {
        factionInstance.exitChallenge();
      }
      realClose();
    };
    btn.innerHTML = factionInstance.inChallenge !== null ? "Exit Challenge" : "Do this challenge!";
    btn.disabled = factionInstance.inChallenge === null;

    cancelBtn.classList.add("fancy-btn");
    cancelBtn.onclick = realClose;
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
