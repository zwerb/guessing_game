/* 

Write your guess-game code here! Don't forget to look at the test specs as a guide. You can run the specs
by running "testem".

In this file, you will also include the event listeners that are needed to interact with your HTML file when
a user clicks a button or adds a guess to the input field.

*/

function generateWinningNumber() {
  return Math.floor(Math.random() * 100) + 1;
}

function shuffle(arr) {
  arr.sort(() => Math.random() - 0.5);
  return arr;
}

class Game {
  constructor() {
    this.playersGuess = null;
    this.pastGuesses = [];
    this.winningNumber = generateWinningNumber();
    this.playingStatus = "playing";
  }

  difference() {
    return Math.abs(this.winningNumber - this.playersGuess);
  }

  getPlayingStatus(){
      return this.playingStatus;
  }

  isLower() {
    return this.playersGuess < this.winningNumber;
  }

  getLastGuess() {
    return this.pastGuesses.slice(-1)[0] ;
  }

  checkGuess(num) {
    let returnStr = "Error";
    if (num == this.winningNumber) {
      returnStr = "You Win!";
      this.playingStatus = "won";
    } else if (this.pastGuesses.length >= 4) {
      this.playingStatus = "lost";
      returnStr = "You Lose.";
    } else if (this.pastGuesses.includes(num)) {
      returnStr = "You have already guessed that number.";
    } else {
      if (this.difference() < 10) {
        returnStr = "You're burning up!";
      } else if (this.difference() < 25) {
        returnStr = "You're lukewarm.";
      } else if (this.difference() < 50) {
        returnStr = "You're a bit chilly.";
      } else if (this.difference() < 100) {
        returnStr = "You're ice cold!";
      }
    }
    return returnStr;
  }

  getRemainingGuesses() {
    return 5 - this.pastGuesses.length;
  }

  playersGuessSubmission(num) {
    let returnStr = "Error";
    let tempNum = isNaN(parseInt(num)) ? "invalid" : parseInt(num);

    if (this.playingStatus != "playing") {
      returnStr = "Error, invalid game state.";
      throw `The player has already ${this.playingStatus}.`;
    } else if (
      !(typeof tempNum === "number" && tempNum <= 100 && tempNum >= 1)
    ) {
      returnStr = "Error, invalid guess";
      throw "That is an invalid guess.";
    } else {
      this.playersGuess = tempNum;
      returnStr = this.checkGuess(tempNum);
      if(!this.pastGuesses.includes(tempNum)){
          this.pastGuesses.push(tempNum);
      }
    }
    return returnStr;
  }

  provideHint() {
    let arr = [];
    arr.push(this.winningNumber);
    for (let i = 0; i < 2; i++) {
      let tmp = generateWinningNumber();
      while (tmp == this.winningNumber) {
        tmp = generateWinningNumber();
      }
      arr.push(tmp);
    }

    shuffle(arr);
    return arr;
  }
}

function newGame() {
  return new Game();
}

/* Delete Below Here to Test the Specs */

let spiel = new Game();

const playAgainButton = document.querySelector(
  "div#guess_box button[name='play_again']"
);

playAgainButton.addEventListener("click", () => {
  startGame();
});

const hintButton = document.querySelector("div#guess_box button[name='hint']");

hintButton.addEventListener("click", () => {
  document.querySelector(
    "div#hint_area"
  ).innerHTML = `<h4>Hint: [${spiel.provideHint().join(", ")}]`;
});

const guessSubmitButton = document.querySelector(
  "div#guess_box button[name='submit_guess']"
);

guessSubmitButton.addEventListener("click", () => {
  let guessText = document.querySelector(
    "div#guess_box input[name='guess_text']"
  );
  let playerGuess = guessText.value;
  //   console.log(`You guessed: [${playerGuess}].`);
  guessText.innerHTML = "";
  guessText.value = "";

  try {
    let result = spiel.playersGuessSubmission(playerGuess);

    if (
      result.includes("Won!") ||
      result.includes("Lost.") ||
      result.includes("Error") ||
      result.includes("already guessed")
    ) {
      //.. do nothing
    } else {
      let guessedList = document.querySelector("div#previous_guesses ul");
      guessedList.innerHTML += `<li>${spiel.getLastGuess()}</li>`;
      document.querySelector(
        "div#remaining_guesses span"
      ).innerHTML = spiel.getRemainingGuesses();
    }

    document.querySelector("div#status_area h2").innerHTML = `${result}`;
  } catch (error) {
    console.error(error);
    if (spiel.getPlayingStatus() == "playing") {
      document.querySelector("div#status_area h2").innerHTML = `Invalid input.`;
    }
  }
});

function startGame() {
  spiel = new Game();

  document.querySelector("div#previous_guesses ul").innerHTML = "";
  document.querySelector("div#status_area h2").innerHTML = "";
  document.querySelector(
    "div#remaining_guesses span"
  ).innerHTML = spiel.getRemainingGuesses();
  document.querySelector("div#hint_area").innerHTML = "";

  //   console.log(`Started new spiel with winningNumber: [${spiel.winningNumber}].`);
}

startGame();
