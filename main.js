import "./factions/count.js";
import "./factions/tree.js";
import "./factions/letter.js";
import "./factions/xx.js";
import "./factions/ones.js";
import "./factions/factorial.js";

const factions = ["Classic", "Tree", "Letter", "X X", "Ones", "Factorial"]
document.getElementById("content").innerHTML = factions.map(i=>`<faction-disp name="${i}"></faction-disp>`).join('')