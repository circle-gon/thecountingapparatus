import { basicCount } from "./factions/count.js"
import { treeCount } from "./factions/tree.js"
import { letterCount } from "./factions/letter.js"
import { xxCount } from "./factions/xx.js"
import { onesCount } from "./factions/ones.js"
import { factorialCount } from "./factions/factorial.js"

const RULES = {
  Classic: [
    "1) Count as high as possible in increments of Effective X.",
    "2) Milestones occur every power of 10 and yield unbans & letter stock.",
    "3) Type \"unban <function_name>\" to unban a function (one function at a time). This counts as a post."
    ],
  
  Tree: [
    "1) Count as high as possible with a 1 day slowmode", //1 day should be modifiable
    "2) Milestones occur every perfect square and yield unbans.",
    "3) Grid size "
    "4) Type \"unban <function_name>\" to unban a function (one function at a time). This counts as a post."
  ],
  
  Letter: [
    
  ],
  
  X_X: [
    
  ],
  
  Ones: [
    
  ],
  
  Factorial: [
    
  ]
}

const RULES_ABRIDGED = {
  Classic: [
    "Standard counting",
    "Benefits: Unbans functions, yields Letter stock",
    "Current Count"+basicCount.count,
    "Current Milestones"+basicCount.milestones,
  ],
  
  Tree: [
    "Slowmode counting",
    "Benefits: Unbans functions, increases Character Limit of messages",
    "Current Count"+treeCount.count,
    "Current Milestones"+treeCount.milestones,
  ],
  
  Letter: [
    "Counting with Letters",
    "Benefits: Reduces effective milestones, Unlocks functions",
    "Current Count"+letterCount.count,
    "Current Milestones"+letterCount.milestones,
    
  ],
  
  X_X: [
    
  ],
  
  Ones: [
    
  ],
  
  Factorial: [
    
  ]
}