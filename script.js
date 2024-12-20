// Initialize audio objects for different sound files

const audioYellow = new Audio("./assets/yellow.mp3");
const audioBlue = new Audio("./assets/blue.mp3");
const audioRed = new Audio("./assets/red.mp3");
const audioGreen = new Audio("./assets/green.mp3");
const audioWrong = new Audio("./assets/wrong.mp3");

// Cache jQuery selectors for the body and buttons

const body = $("body");
const btns = $(".btn");
const btnYellow = $("#yellow");
const btnBlue = $("#blue");
const btnRed = $("#red");
const btnGreen = $("#green");

// An array of objects, each containing an id, a button element and its corresponding audio

const buttons = [
    {
        id: "yellow",
        button: btnYellow,
        audio: audioYellow
    },
    {
        id: "blue",
        button: btnBlue,
        audio: audioBlue
    },
    {
        id: "red",
        button: btnRed,
        audio: audioRed
    },
    {
        id: "green",
        button: btnGreen,
        audio: audioGreen
    }
]; 

const container = $("#container") // Select the button's container div
const gameStatus = $("#game-status"); // Select the h2 element that displays the game status
const highestScoreElement = $("#highest-score"); // Select the h2 element that displays the highest score achieved by the player

const gamePattern = []; // Keeps track of the game's pattern sequence 
const userPattern = []; // Keeps track of the user's input sequence

let level = 0; // Current game level
let score = 0; // Current score
let highestScore = 0; // Highest score achieved

/* It is the default game status 
   gameEnded -> true (Click events would have no effect) 
   gameEnded -> false (Key press events would have no effect) */

let gameEnded = true; 

// A function that returns a random button object for every new level

function randomButton() {
    return buttons[Math.floor(Math.random()*4)];
}

/* This function clears the contents of the given array.
   - On level up, it clears the userPattern array.
   - On game over, it clears both the gamePattern and userPattern arrays. */

function emptyArray(arr) {
    arr.splice(0, arr.length);
}

/* This function is triggered when the player clears the previous level 
   It manages global identifiers, and calls the randomButton() function to get a random button object
   The "level-up" class is toggled on the button element (DOM element) to apply CSS styling, and the corresponding sound is played 
   Finally, it returns the ID associated with the random button object */

function levelUp() {
    emptyArray(userPattern);
    level++;
    const buttonObj = randomButton();
    buttonObj.button.toggleClass("level-up");
    buttonObj.audio.play();
    setTimeout(function() {
        buttonObj.button.toggleClass("level-up");
    }, 300);
    return buttonObj.id;
}

/* The function is triggered for every key press event
   The conditional statement ensures the code inside only runs when the game is in initial or final state (gameEnded = true)
   The slideDown() method has been used for animation to make the user experience more interactive
   The setTimeout() function ensures the animation doesn't interfere with the game's functionality */

function startGame() {
    if(gameEnded) {
        container.slideDown(300);
        setTimeout(function() {
            gamePattern.push(levelUp()); // Starts off the game sequence
            gameStatus.html(`Level: ${ level }`);
        }, 600);
    }
}

/* It toggles the "clicked" class from the button element of the object which affects the css styling
   for the element along with playing the corresponding sound signifying that the button has been clicked
   Finally, it returns the ID associated with the object */

function buttonClicked(id) {
    const buttonObj = buttons.find(function(obj) {
        return obj.id == id;
    });
    buttonObj.button.toggleClass("clicked");
    buttonObj.audio.play();
    setTimeout(function() {
        buttonObj.button.toggleClass("clicked");
    }, 300);
    return buttonObj.id;
}

/* The function checks if the gamePattern and userPattern arrays follow the same pattern 
   It is triggered for every click event */

function patternCheck() {
    for(let i = 0; i < userPattern.length; i++) {
        if(userPattern[i] != gamePattern[i]) {
            return false;
        }
    }
    return true;
}

/* This function is triggered when the game ends. 
   It handles the global identifiers by setting them to their default state. 
   Visual and audible changes are applied to signify the game over state: 
   - The "game-over" class is toggled on the body element to apply CSS styling.
   - The container is slid up to indicate the end of the game.
   - An error sound is played.
   Finally, the game over message with the player's score is displayed, and the user is prompted to press any key to restart. */

function gameOver() {
    gameEnded = true;
    emptyArray(gamePattern);
    emptyArray(userPattern);
    body.toggleClass("game-over");
    container.slideUp(300);
    audioWrong.play();
    setTimeout(function() {
        body.toggleClass("game-over");
    }, 300);
    gameStatus.html(`Game Over! Your score was ${ score }<br>Press any key to start.`);
}

/* The function sets the highestScore identifier to a new value if the player has surpassed his/her previous record
   It also sets the score and level identifiers to their default state */

function handleStats() {
    if(score > highestScore) {
        highestScore = score;
    }
    score = 0;
    level = 0;
}

// Handles the key press event

body.keydown(function() {
    startGame();
    gameEnded = false;
});

// Handles the click event

btns.click(function() {
    if(!(gameEnded)) {
        userPattern.push(buttonClicked(this.id)); // Pushes the user input sequence into the userPattern array
        if(patternCheck()) {
            if(userPattern.length == gamePattern.length) {
                // Level cleared
                setTimeout(function() {
                        score++;
                        gamePattern.push(levelUp()); // Pushes the random sequence into the gamePattern array
                        gameStatus.html(`Level: ${ level }`); 
                }, 1000);
            }
        } else {
            // Level failed
            gameOver();
            handleStats();
            highestScoreElement.html(`Highest Score: ${ highestScore }`);
        }
    }
});

