import { ce } from "../text/channel.js";
import {RULES_ABRIDGED} from '../utils/constants.js'
import {factions} from '../factions/factions.js'

const screens = {
  main() {
    const chat = ce("tabs-main");
    chat.setAttribute("tabs", "faction,chat");
    return chat;
  },
  challengeScreen(facInstance) {
    function leave() {
      stop.forEach(i => clearInterval(i))
      switchScreen("main")
    }
    
    const body = ce("div");
    const chalSelect = ce("div");
    const chalDesc = ce("div");
    const desc = ce("div");
    const buttonStart = ce("button");
    let chalSelected;
    const stop = []
    
    body.style.display = "grid";
    body.style.gridTemplateColumns = "25% 75%";
    body.style.alignItems = "stretch";
    body.style.justifyItems = "stretch";
    body.style.height = "calc(100% - 10px)";
    body.style.width = "calc(100% - 10px)";
    body.style.margin = "5px";

    chalSelect.classList.add("bordery");
    chalSelect.style.gridColumn = "1";
    chalSelect.style.marginRight = "5px";
    chalSelect.style.position = "relative";

    {
      const header = ce("div");
      const miniText = ce("div");
      header.innerHTML = "Challenges";
      header.style.fontWeight = "bold";
      header.style.fontSize = "30px";
      header.style.textAlign = "center";

      miniText.style.textAlign = "center";
      miniText.style.fontSize = "10px";
        
      function updateMiniText() {
        miniText.innerHTML = "(" +
        (facInstance.inChallenge === null
          ? "You are not in a challenge"
          : `You are in challenge ${
              facInstance.challengeDetails[facInstance.inChallenge].title
            }`) +
        ")";
      }
      stop.push(setInterval(() => {
        updateMiniText()
      }))
      updateMiniText()
      
      chalSelect.append(header, miniText);
      facInstance.challengeDetails.forEach((i, ind) => {
        const chal = ce("div");
        chal.innerHTML = i.title;
        chal.onclick = function () {
          const requireHTML = ce("div")
          requireHTML.innerHTML = `Requirement: ${facInstance.challengeDetails[ind].requirementDesc}`
          const currChalSelect = chalSelected
          desc.innerHTML = `
            ${i.description}<br>
            Progress: ${facInstance.challenges[ind]}
          `;
          
          function updateHTML() {
            const isUnlocked = facInstance.challengeUnlocked(ind)
            requireHTML.style.color = isUnlocked ? "green" : "red"
            buttonStart.disabled = !isUnlocked
          }
          
          const poll = setInterval(() => {
            if (currChalSelect !== chalSelected) {
              stop.splice(stop.indexOf(poll), 1)
              clearInterval(poll)
              return
            }
            updateHTML()
          }, 50)
          stop.push(poll)
          
          desc.append(requireHTML)
          updateHTML()
          chalSelected = ind;
          
        };
        chal.style.padding = "0";
        chal.classList.add("channel");
        chalSelect.append(chal);
      });

      const container = ce("div");
      container.style.position = "absolute";
      container.style.bottom = "0";
      container.style.left = "50%";
      container.style.transform = "translateX(-50%)";
      container.style.width = "100%";

      const goBack = ce("button");
      goBack.innerHTML = "Go Back";
      goBack.classList.add("fancy-btn");
      goBack.onclick = function () {
        leave()
      };
      goBack.style.width = "100%";
      container.append(goBack)

      if (facInstance.inChallenge !== null) {
        goBack.style.width = "50%";

        const exit = ce("button");
        exit.innerHTML = "Exit Challenge";
        exit.classList.add("fancy-btn");
        exit.onclick = function () {
          facInstance.exitChallenge();
          leave()
        };
        exit.style.width = "50%";
        container.append(exit);
      }

      chalSelect.append(container);
    }

    buttonStart.disabled = true;
    buttonStart.onclick = function () {
      facInstance.enterChallenge(chalSelected);
      leave()
    };
    buttonStart.innerHTML = "Start!";
    buttonStart.classList.add("fancy-btn");

    chalDesc.classList.add("bordery");
    chalDesc.style.gridColumn = "2";
    chalDesc.style.textAlign = "center";
    chalDesc.style.display = "flex";
    chalDesc.style.flexDirection = "column";
    chalDesc.style.alignItems = "center";
    chalDesc.style.justifyContent = "space-between";
    chalDesc.style.padding = "20px";
    chalDesc.append(desc, buttonStart);

    body.append(chalSelect, chalDesc);
    return body;
  },
  selectFaction() {
    const ele = ce("div")
    const buttons = ce("div")
    const topText = ce("div")
    topText.innerHTML = "Welcome!<br>Select a faction below: ";
    const length = Object.keys(RULES_ABRIDGED).length
    for (const [name, rules] of Object.entries(RULES_ABRIDGED)) {
      const btn = ce("button")
      btn.innerHTML = `${name}<br>${rules.join("<br>")}`
      btn.onclick = function() {
        // not implemented for now
        switchScreen("main")
        factions[name].textBox.unFreeze()
        factions[name].chatBox.unFreeze()
      }
      btn.style.width = `${100 / length}%`
      btn.classList.add("fancy-btn")
      btn.style.minHeight = "100px"
      buttons.append(btn)
    }
    
    ele.style.textAlign = "center"
    ele.style.display = "flex"
    ele.style.justifyContent = "space-between"
    ele.style.alignItems = "center"
    ele.style.flexDirection = "column"
    ele.style.height = "100%"
    ele.style.padding = "20px 0";    
    ele.append(topText, buttons)
    return ele
  }
};
const ele = document.getElementById("screen");

export function switchScreen(name, ...args) {
  // TODO: better method?
  ele.innerHTML = "";
  const mod = screens[name];
  const result = typeof mod === "string" ? mod : mod(...args);
  if (typeof result === "string") {
    ele.innerHTML = result;
  } else if (Array.isArray(result)) {
    ele.append(...result);
  } else {
    ele.append(result);
  }
}

window.switchScreen = switchScreen;

