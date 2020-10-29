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

  getPlayingStatus() {
    return this.playingStatus;
  }

  isLower() {
    return this.playersGuess < this.winningNumber;
  }

  getLastGuess() {
    return this.pastGuesses.slice(-1)[0];
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
      if (!this.pastGuesses.includes(tempNum)) {
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

let btn_past_guess = `<div class="list-group-item zb-list-group-item">
      <span class="badge %badge_type% zb-badge">%guess%</span>
      <span class="zb-list-notification"><i class="zb-fa fa %icon_type%"></i>%suggestion%</span></div>`;

let spiel = new Game();

const playAgainButton = document.querySelector(
  "#guess_box button[name='play_again']"
);

playAgainButton.addEventListener("click", () => {
  startGame();
});

const hintButton = document.querySelector("div#guess_box button[name='hint']");

hintButton.addEventListener("click", () => {
  document.querySelector("#hint_area").classList.add("zb-card-body-bot");
  document.querySelector(
    "#hint_area"
  ).innerHTML = `<h5>Hint: it's one of these --> [${spiel.provideHint().join(", ")}]</h5>`;
});

const guessSubmitButton = document.querySelector(
  "#guess_box button[name='submit_guess']"
);

guessSubmitButton.addEventListener("click", () => {
  let guessText = document.querySelector("#guess_box #guess_text");
  let playerGuess = guessText.value;
  console.log(`You guessed: [${playerGuess}].`);
  guessText.innerHTML = "";
  guessText.value = "";

  try {
    let result = spiel.playersGuessSubmission(playerGuess);

    if (

      result.includes("Error") ||
      result.includes("already guessed")
    ) {
      //.. do nothing
      // result.includes("Win!") ||
      // result.includes("Lose.") ||
    } else {
      let guessedList = document.querySelector("#guess_display_list");
      let badge_type = "";
      if (spiel.difference() < 10) {
        badge_type = "badge-success";
      } else if (spiel.difference() < 25) {
        badge_type = "badge-warning";
      } else if (spiel.difference() < 50) {
        badge_type = "badge-danger";
      } else {
        badge_type = "badge-info";
      }
      
      document.querySelector("#guess_history").style.visibility = 'visible';
      let icon_type = spiel.isLower() ? "fa-arrow-up" : "fa-arrow-down";
      icon_type = spiel.getPlayingStatus().includes("won")
        ? "fa-check-circle"
        : spiel.getPlayingStatus().includes("lost") ? "fa-times-circle" : icon_type;
      let extra_hint = spiel.isLower() ? "(Try higher)" : "(Try lower)";
      extra_hint = spiel.getPlayingStatus().includes("won")
      ? "Boom!"
      : spiel.getPlayingStatus().includes("lost") ? "Sorry!" : extra_hint; 
      guessedList.innerHTML =
        btn_past_guess
          .replace("%badge_type%", badge_type)
          .replace("%guess%", playerGuess)
          .replace("%icon_type%", icon_type)
          .replace("%suggestion%", result + " " + extra_hint) + guessedList.innerHTML;
      // make it flash once
      let newNotificationDiv = document.querySelector("#guess_display_list div");
      newNotificationDiv.classList.add("zb-list-group-item-shine");
      setTimeout(function() {
        newNotificationDiv.classList.remove("zb-list-group-item-shine");
     }, 250);
          
      document.querySelector(
        "#remaining_guesses span#remaining_guess_number"
      ).innerHTML = spiel.getRemainingGuesses();
    }

    // Show The Status Regardless
    document.querySelector("#guess_history").style.visibility = 'visible';
    document.querySelector("#status_area").classList.add("zb-card-body-top");
    document.querySelector("#status_area h2").innerHTML = `${result}`;

    if (result.includes("Win!") || result.includes("Lose.")) {
      document.querySelector("#guess_text").placeholder = spiel.getPlayingStatus().includes("won") ? "Congratulations!" : "Game Over";
      document.querySelector("#guess_text").disabled = true;
      let icon_type = spiel.getPlayingStatus().includes("won")
        ? "fa-check-circle"
        : "fa-times-circle";
      guessedList.innerHTML =
        btn_past_guess
          .replace("%badge_type%", badge_type)
          .replace("%guess%", playerGuess)
          .replace("%icon_type%", icon_type)
          .replace("%suggestion%", result) + guessedList.innerHTML;
      document.querySelector(
        "#remaining_guesses span#remaining_guess_number"
      ).innerHTML = spiel.getRemainingGuesses();
    }
  } catch (error) {
    console.error(error);
    if (spiel.getPlayingStatus() == "playing") {
      document.querySelector("#status_area").classList.add("zb-card-body-top");
      document.querySelector("#status_area h2").innerHTML = `Invalid input.`;
    }
  }
});

function startGame() {
  spiel = new Game();

  //document.querySelector("div#previous_guesses ul").innerHTML = "";
  document.querySelector("#status_area h2").innerHTML = "";
  document.querySelector("#status_area").classList.remove("zb-card-body-top");
  document.querySelector(
    "#remaining_guesses span#remaining_guess_number"
  ).innerHTML = spiel.getRemainingGuesses();
  // document.querySelector("#status_area").style.visibility = 'hidden';
  document.querySelector("#hint_area").innerHTML = "";
  document.querySelector("#hint_area").classList.remove("zb-card-body-bot");
  document.querySelector("#guess_display_list").innerHTML = "";
  document.querySelector("#guess_text").disabled = false;
  // document.querySelector("#guess_history").style.visibility = 'hidden';
  document.querySelector("#guess_text").placeholder = "Enter number [1-100]...";
  //document.querySelector("#previous_guesses").style.visibility = "hidden";

  //   console.log(`Started new spiel with winningNumber: [${spiel.winningNumber}].`);
}

startGame();
