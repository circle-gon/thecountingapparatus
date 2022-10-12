import "./factions/count.js";


import "./factions/tree.js";
document.getElementById("content2").innerHTML = `<faction-disp name="Tree"/>`;

import "./factions/letter.js";
document.getElementById("content3").innerHTML = `<faction-disp name="Letter"/>`;
let html = .map(i=>`<faction-disp name="${i}" />`).join("")
document.getElementById("content").innerHTML = html