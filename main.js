import "./factions/count.js";
import "./factions/tree.js";
import "./factions/letter.js";
import "./factions/xx.js";
import "./factions/ones.js";
import "./factions/factorial.js";
import './factions/parserTestingFaction.js'
import './text/groups.js'
import './text/main.js'
import './ui/modals.js'

import { switchScreen } from './ui/cutscreen.js'
switchScreen("selectFaction")

import {factions} from '../factions/factions.js'

for (const f of Object.values(factions)) {
  f.textBox.freeze()
  f.chatBox.freeze()
}