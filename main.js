import "./factions/count.js";
import "./factions/tree.js";
import "./factions/letter.js";
import "./factions/xx.js";

const factions = ["Classic", "Tree", "Letter", "X X"]
document.getElementById("content").innerHTML = factions.map(i=>`<faction-disp name="${i}"></faction-disp>`).join('')