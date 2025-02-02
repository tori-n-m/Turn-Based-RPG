// Initialize player stats
let xp = 0; // Experience points
let health = 100; // Player health
let gold = 50; // Player gold
let currentWeapon = 0; // Index of the currently equipped weapon
let fighting; // Tracks the current monster being fought (index in the monsters array)
let monsterHealth; // Tracks the health of the current monster
let weaponInventory = ["stick"]; // Player's inventory (starts with a stick)

let dialogueCount = 0; //tracks scripted dialogue

// Grab references to HTML elements
const button1 = document.querySelector('#button1');
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const button4 = document.querySelector('#button4')
const allButtons = [button1, button2, button3, button4];
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterName = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");
const currentImage = document.getElementById("currentImage");
const nextButton = document.querySelector("#nextButton");

//image references
const salamander = "images/character/salamander.png";
const storeClerk = "images/enemies/goblin.png";
const harpy = "images/enemies/harpy.png";


const healthPotion = "images/potions/health potion.png";

const stick = "images/weapons/practice sword.png";
const woodenSword = "images/weapons/wooden sword.png";
const bronzeSword = "images/weapons/bronze sword.png";
const ironSword = "images/weapons/iron sword.png";

const natureSlime = "images/enemies/nature slime.png";
const treant = "images/enemies/treant.png";
const mantis = "images/enemies/mantis.png";
const venomousSnake = "images/enemies/venomous snake.png";


// Define weapons with their names and power levels
const weapons = [
  { name: ' stick', power: 5, image: stick, price: 0, sellPrice: 5},
  { name: ' wooden sword', power: 30, image: woodenSword, price: 25, sellPrice: 10},
  { name: ' bronze sword', power: 50, image: bronzeSword, price: 35, sellPrice: 15},
  { name: ' iron sword', power: 100, image: ironSword, price: 45, sellPrice: 25}
];

// Define monsters with their names, levels, and health
const monsters = [
  { name: "Nature slime", level: 2, health: 15, image: natureSlime},
  { name: "Treant", level: 8, health: 60, image: treant},
  { name: "Mantis", level: 20, health: 200, image: mantis},
  { name: "Venomous snake", level: 30, health: 350, image: venomousSnake}
];

// Define first area locations, their button texts, actions, and descriptions
const locations = [
  {
    name: "town square",
    "button text": ["Go to store", "Go to forest", "Check Inventory", "Fight boss"],
    "button functions": [goStore, goCave, checkInventory, fightVenomousSnake],
    text: "You are in the town square.",
    image: salamander
    
  },
  {
    name: "store",
    "button text": ["Buy 10 health (10 gold)", "Buy weapon (30 gold)", "Sell item", "Go to town square"],
    "button functions": [buyHealth, buyWeapon, sellItem, goTown],
    text: "You enter the store.",
    image: storeClerk
    
  },
  {
    name: "cave",
    "button text": ["Fight slime", "Fight treant", "fight mantis", "Go to town square",],
    "button functions": [fightSlime, fightTreant, fightMantis, goTown],
    text: "You enter the cave. You see some monsters.",
    image: salamander
  },
  {
    name: "fight",
    "button text": ["Attack", "Dodge", "Use item", "Run"],
    "button functions": [attack, dodge, useItem, goTown],
    text: "You are fighting a monster.",
    image: salamander

  },
  {
    name: "kill monster",
    "button text": ["Go to town square", "Go to town square", "Go to town square", "Go to town square"],
    "button functions": [goTown, goTown, useItem, goTown],
    text: 'The monster screams "Arg!" as it dies. You gain experience points and find gold.',
    image: salamander
  },
  {
    name: "lose",
    "button text": ["REPLAY?", "REPLAY?", "REPLAY?", "REPLAY?"],
    "button functions": [restart, restart, restart, restart],
    text: "You die. &#x2620;",
    image: salamander
  },
  { 
    name: "win", 
    "button text": ["REPLAY?", "REPLAY?", "REPLAY?", "REPLAY?"], 
    "button functions": [restart, restart, restart, restart], 
    text: "You defeat the dragon! YOU WIN THE GAME! &#x1F389;",
    image: salamander
  },
  {
    name: "easter egg",
    "button text": ["2", "8", "placeholder", "Go to town square?"],
    "button functions": [pickTwo, pickEight, pickEight, goTown],
    text: "You find a secret game. Pick a number above. Ten numbers will be randomly chosen between 0 and 10. If the number you choose matches one of the random numbers, you win!",
    image: salamander
  }
];

// Initialize button actions

/*
button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightVenomousSnake;
*/


introDialogue();



/**
 * Updates the game UI and button actions based on the given location.
 * @param {Object} location - The location to update the game to.
 */
function update(location) {
  monsterStats.style.display = "none"; // Hide monster stats by default
  button1.innerText = location["button text"][0]; // Update button 1 text
  button2.innerText = location["button text"][1]; // Update button 2 text
  button3.innerText = location["button text"][2]; 
  button4.innerText = location["button text"][3];// Update button 3 text
  button1.onclick = location["button functions"][0]; // Update button 1 action
  button2.onclick = location["button functions"][1]; // Update button 2 action
  button3.onclick = location["button functions"][2]; // Update button 3 action
  button4.onclick = location["button functions"][3];
  text.innerHTML = location.text; // Update the game text;
  currentImage.src = location.image;

}

// Define location transition functions
function goTown() { update(locations[0]); }
function goStore() {update(locations[1]); }
function goCave() { update(locations[2]); }

// Store functions
function buyHealth() {
  if (gold >= 10) {
    gold -= 10;
    health += 10;
    goldText.innerText = gold;
    healthText.innerText = health;
    currentImage.src = healthPotion;
  } else {
    text.innerText = "You do not have enough gold to buy health.";
  }
}

function buyWeapon() {
  if (currentWeapon < weapons.length - 1) {
    if (gold >= 30) {
      gold -= 30;
      currentWeapon++;
      goldText.innerText = gold;
      currentImage.src = weapons[currentWeapon].image;
      let newWeapon = weapons[currentWeapon].name;
      text.innerText = "You now have a " + newWeapon + ".";
      weaponInventory.push(newWeapon);
      text.innerText += " In your inventory you have: " + weaponInventory;
    } else {
      text.innerText = "You do not have enough gold to buy a weapon.";
    }
  } else {
    text.innerText = "You already have the most powerful weapon!";
    button2.innerText = "Sell weapon for 15 gold";
    button2.onclick = sellWeapon;
  }
}

function sellWeapon() {
  if (weaponInventory.length > 1) {
    gold += 15;
    goldText.innerText = gold;
    let currentWeapon = weaponInventory.shift();
    text.innerText = "You sold a " + currentWeapon + ".";
    currentImage.src = weaponInventory[currentWeapon].image;
    text.innerText += " In your inventory you have: " + weaponInventory;
  } else {
    text.innerText = "Don't sell your only weapon!";
  }
}

// Fight functions
function fightSlime() { fighting = 0; goFight(); }
function fightTreant() { fighting = 1; goFight(); }
function fightMantis() {fighting = 2; goFight(); }
function fightVenomousSnake() { fighting = 3; goFight(); }

//PLACEHOLDER FUNCTIONS
function checkInventory(){
  text.innerText = "Weapons: " + weaponInventory;


}

function sellItem(){
  //will use and replace sell weapon
  text.innerText = "Click on the item you'd like to sell: ";
  for (let item of weaponInventory){
    text.innerText += item + " selling price: " + item.sellPrice;
  }
  
}

function useItem(){

}


/**
 * Sets up the fight with the current monster.
 */
function goFight() {
  update(locations[3]);
  monsterHealth = monsters[fighting].health;
  currentImage.src = monsters[fighting].image;
  monsterStats.style.display = "block"; // Show monster stats
  monsterName.innerText = monsters[fighting].name;
  monsterHealthText.innerText = monsterHealth;
}

// Attack functionality
function attack() {
  text.innerText = "The " + monsters[fighting].name + " attacks.";
  text.innerText += " You attack it with your " + weapons[currentWeapon].name + ".";
  health -= getMonsterAttackValue(monsters[fighting].level);
  if (isMonsterHit()) {
    monsterHealth -= weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1;    
  } else {
    text.innerText += " You miss.";
  }
  healthText.innerText = health;
  monsterHealthText.innerText = monsterHealth;
  if (health <= 0) {
    lose();
  } else if (monsterHealth <= 0) {
    if (fighting === 3) {
      winGame();
    } else {
      defeatMonster();
    }
  }

}

// Utility functions
function getMonsterAttackValue(level) {
  const hit = (level * 5) - (Math.floor(Math.random() * xp));
  return hit > 0 ? hit : 0;
}

function isMonsterHit() {
  return Math.random() > .05 || health < 20;
}

function dodge() {
  text.innerText = "You dodge the attack from the " + monsters[fighting].name;
}

function defeatMonster() {
  gold += Math.floor(monsters[fighting].level * 6.7);
  xp += monsters[fighting].level;
  goldText.innerText = gold;
  xpText.innerText = xp;
  update(locations[4]);
}

function lose() {
  update(locations[5]);
}

function winGame() {
  update(locations[6]);
}

function restart() {
  xp = 0;
  health = 100;
  gold = 50;
  currentWeapon = 0;
  weaponInventory = ["stick"];
  goldText.innerText = gold;
  healthText.innerText = health;
  xpText.innerText = xp;
  goTown();
}

// Easter egg functionality
function easterEgg() { update(locations[7]); }
function pickTwo() { pick(2); }
function pickEight() { pick(8); }
function pick(guess) {
  const numbers = [];
  while (numbers.length < 10) {
    numbers.push(Math.floor(Math.random() * 11));
  }
  text.innerText = "You picked " + guess + ". Here are the random numbers:\n";
  for (let i = 0; i < 10; i++) {
    text.innerText += numbers[i] + "\n";
  }
  if (numbers.includes(guess)) {
    text.innerText += "Right! You win 20 gold!";
    gold += 20;
    goldText.innerText = gold;
  } else {
    text.innerText += "Wrong! You lose 10 health!";
    health -= 10;
    healthText.innerText = health;
    if (health <= 0) {
      lose();
    }
  }
}


//Scripted dialogue functionality
function scriptedDialogue(){
  button1.onclick = null;
  button2.onclick = null;
  button3.onclick = null;
  button3.onclick = null;
  nextButton.style.display = "block"; 
  
}
function introDialogue(){
  if(dialogueCount == 0){
    scriptedDialogue();
    text.innerText = "Welcome to Salamander RPG! You are a cute salamander named Leo. Leo lives in a tree in a dangerous forest filled with monsters! His whole life he has been safely in his tree. However, he decides tonight he wants to venture out to find his dad.";
   
    // First click - Show next dialogue
    nextButton.onclick = function() {
      text.innerText = "Leo lives with his best friend Fran. Fran saved Leo when he was a baby salamander. After Leo's dad abandoned him, Fran swooped up and saved him from the volcano, bringing him to the forest.";
      currentImage.src = harpy;
      nextButton.onclick = secondClick; // Set the next step
    };
    
    function secondClick() {
      text.innerText = "Fran always warned Leo not to leave past their territory of the forest. The forest is far too dangerous for the both of them. However, Leo knows he must venture far to find his long lost father.";
      nextButton.onclick = thirdClick;
    }

    function thirdClick() {
      text.innerText = "So, Leo must sneak out tonight against his better judgement.";
      currentImage.src = salamander; // Change the image at this step
      
      // Hide the next button and enable the store button
      nextButton.style.display = "none"; 
      dialogueCount++;
      button1.onclick = storeDialogue;
      button1.style.display = "block";
    }

    
  }
}

function storeDialogue(){
  if(dialogueCount == 1){
    scriptedDialogue();
    button1.style.display = "none";
    text.innerText = "Leo carefully crawls out of the tree and quietly ventures through the forest. In the distance, he sees a friendly-looking goblin who seems to be running a store.";

    nextButton.onclick = function() {
      text.innerText = "Hello! What can I help you with?";
      currentImage.src = storeClerk;
      nextButton.onclick = secondClick; 
    };

    function secondClick() {
      text.innerText = "I want to reach the volcano. What do I need to buy?";
      currentImage.src = salamander;
      nextButton.onclick = thirdClick;
    }

    function thirdClick() {
      text.innerText = "The volcano? You're going to the volcano?? And all you have is a stick? You're funny.";
      currentImage.src = storeClerk; 
      nextButton.onclick = fourthClick;
  }

  function fourthClick(){
    text.innerText = "Yes. That is why I am here to buy whatever gets me up there. Do you speak this way to all your customers?";
    currentImage.src = salamander;
    nextButton.onclick = fifthClick;

  }

  function fifthClick(){
    text.innerText = "I'm just worried for your safety little salamander. You could easily get killed out there. I sell some basic health and weapons here that may help, but I wouldn't advise going too far.";
    currentImage.src = storeClerk;
    nextButton.onclick = sixthClick;
  }

  function sixthClick(){
    nextButton.style.display = "none";
    //allButtons.style.display = "block";
    /*
    button1.style.display = "block";
    button2.style.display = "block";
    button3.style.display = "block";
    */
    for (let button of allButtons) {
      button.style.display = "inline-block";
    }
    dialogueCount++;
    
    goStore();
    /*

    button1.onclick = goStore;
    button2.onclick = goCave;
    button3.onclick = fightVenomousSnake
    */


  }


    
    

  
}
}
    
 