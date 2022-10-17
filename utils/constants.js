//RULESETS
const RULES = {
  Classic: [
    "1) Count as high as possible in increments of Effective X.",
    "2) Milestones occur every power of 10 and yield unbans & letter stock.",
    "3) Type \"unban <function_name>\" to unban a function (one function at a time). This counts as a post."
    ],
  
  Tree: [
    "1) Count as high as possible with a 1 day slowmode.", //1 day should be modifiable
    "2) Milestones occur every perfect square and yield unbans.",
    "3) Grid size increases every perfect square and increases character limit of messages.",
    "4) Type \"unban <function_name>\" to unban a function (one function at a time). This counts as a post."
  ],
  
  Letter: [
    "1) Count as high as possible using letters instead of numbers.",
    "2) Milestones occur every string of Z's, and subtracts from effective milestones.",
    "3) Unlock functions by hitting their unlock string EXACTLY. Functions are not retroactively unlocked.",
    "4) Type \"suggest <function_name>\" to create a suggestion which will be manually reviewed."
  ],
  // 
  // 
  X_X: [
    "1)  Using only X of a number X; e.g 1 1's, 2 2's, etc.; solve for your next count to count as high as possible.",
    "2)  Milestones occur every X to the Xth power and bans the X most used functions, then increments raw X.",
    "3)  Challenge C unlock when the average of all factions and their challenges hits the Cth multiple of 500.",
    "3a) Your base game, and all odd numbered challenges, are calculated in degrees rather than radians.",
    "3b) Challenge Counts dynamically reduce global milestone scaling, which is weakened based on effective milestones.\n",
    "C1: X = 0",
  ],
  
  Ones: [
    
  ],
  
  Factorial: [
    
  ]
}
const RULES_ABRIDGED = {
  Classic: [
    "Standard counting",
    "Benefits: Unbans functions, yields letter stock",
    "Downsides: Increases effective milestones"
  ],
  
  Tree: [
    "Slowmode counting",
    "Benefits: Unbans functions, increases Character Limit of messages",
    "Downsides: Increases effective milestones"
  ],
  
  Letter: [
    "Counting with Letters",
    "Benefits: Reduces effective milestones, Unlocks functions",
    "Downsides: "
  ],
  
  X_X: [
    "Solving for counts with X amount of a number X",
    "Benefits: Increases Classic Counting speed, Reduces milestone scalings",
    "Downsides: Increases effective milestones, bans functions"
  ],
  
  Ones: [
    "Uniquely solving for counts using only the number 1",
    "Benefits: Reduces Tree slowmode. Multiplies Tree effect on Character Limit. Allows for usage of banned functions",
  ],
  
  Factorial: [
  "solving for counts using factorials of numbers",
  "Benefits: Reduces effective milestones, yields letter stock"
  ]
}

export const EMOJI = [
  {
    name: "gwa",
    src: "https://cdn.glitch.global/c4b4c3c5-22da-4237-8d6f-f6335452d8b5/gwa.png?v=1665428837632"
  }
]