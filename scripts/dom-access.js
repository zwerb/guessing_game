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
