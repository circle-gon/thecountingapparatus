//RULESETS
const RULES = {
  Classic: [
    "1) Count as high as possible.",
    "2) Milestones occur every power of 10 and yield unbans & letter stock.",
    "3) Type \"unban <function_name>\" to unban a function (one function at a time). This counts as a post."
    ],
  
  Tree: [
    "1) Count as high as possible with a 1 day slowmode. Double Posting is allowed.", //1 day should be modifiable
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
    "C1: 0 is a number that has only existed since Egyptian times, but can it brought up in ranks? Count with  = 0",
    "C2: We return back to the basics in this challenge: 1. A fine number, but how lethal can it become? Count with X = 1",
    "C3: Pythagoras was a very important mathematician. Notably for his work with triangles. He pretty much invented trigonometry. See what you can do with one of his constants. Count with X = √2.",
    "C4: What number X when considering the function ˣ√x yields a maximum output? The answer is e. Count with X = ᵉ√e",
    "C5: φ is a number that is rooted in every aspect of life from architecture to nature. But can it be rooted in counting? Count with X = φ",
    "C6: What is even better than φ? Using φ on a circle in some odd fashion. I'd \"b\" happy to show you. Count with X = b",
    "C7: e is very special. It's used in both mathematical and economical fashions. Let's count with it! Count with X = e",
    "C8: Whenever you see π, you either think of circles or trolling; lets focus on that first one. Count with X = π",
    "C9: The Fibonacci sequence is the key to the golden ratio, but what about its reciprocal sum? In this challenge, you'll find out. Count with X = Ψ",
    "C10: Let your imagination run wild with this one. i am dying to know how you guys deal with this. Count with x = i"
  ],
  
  Ones: [
    
  ],
  
  Factorial: [
    
  ]
}
export const RULES_ABRIDGED = {
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
  
  "X X": [
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
  },
  {
    name: "troll",
    src: "https://cdn.glitch.global/3f2f59d8-2911-4afc-a764-529cf5ba8cde/troll.png?v=1666489269973"
  },
  {
    name: "dontaskwhatthisis",
    src: "https://cdn.glitch.global/3f2f59d8-2911-4afc-a764-529cf5ba8cde/5b9b5c09-b5ce-47f1-9a67-ac2044fb9b86.image.png?v=1665763637636"
  }
]