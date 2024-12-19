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
   gameEnded -> false (Keyboard events would have no effect) */

let gameEnded = true; 

// A function that returns a random button object for every new level

function randomButton() {
    return buttons[Math.floor(Math.random()*4)];
}

/* A function that empties the gamePattern or userPattern arrays depending on the circumstance
   Level up -> userPattern
   Game over ->  Both */

function emptyArray(arr) {
    arr.splice(0, arr.length);
}

/* The function is called when the player clears the previous level
   To begin with, it manages certain global identifiers
   It then calls the randomButton() function which returns a random button object
   It adds and removes the "level-up" class from the button element of the object which affects the CSS styling
   for the element along with playing the corresponding sound
   Finally, it returns the ID associated with the object */

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

/* The function is called every time a keyboard button has been pressed
   The conditional statement ensures the code inside only runs when the game is in initial or final state
   The slideDown() method has been used for animation to make the experience more interactive
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

/* It adds and removes the "clicked" class from the button element of the object which affects the css styling
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
   It is called for every click event */

function patternCheck() {
    for(let i = 0; i < userPattern.length; i++) {
        if(userPattern[i] != gamePattern[i]) {
            return false;
        }
    }
    return true;
}

/* To begin with, the function handles some of the global identifiers and sets them to their default state
   It also takes care of some visual and audible changes which signifies that the game has ended */

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

/* The function sets a new highest score for the player if he/she has surpasses their previous record
   It also sets certain identifiers to their default state */

function handleStats() {
    if(score > highestScore) {
        highestScore = score;
    }
    score = 0;
    level = 0;
}

// Handles the keyboard key press event

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

