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
  }

  difference() {
    return Math.abs(this.winningNumber - this.playersGuess);
  }

  isLower() {
    return this.playersGuess < this.winningNumber;
  }

  checkGuess(num) {
    let returnStr = "";
    if (num == this.winningNumber) {
      returnStr = "You Win!";
    } else if (this.pastGuesses.length >= 4) {
      returnStr = "You Lose.";
    } else if (this.pastGuesses.includes(num)) {
      returnStr = "You have already guessed that number.";
    } else if (this.difference() < 10) {
      returnStr = "You're burning up!";
    } else if (this.difference() < 25) {
      returnStr = "You're lukewarm.";
    } else if (this.difference() < 50) {
      returnStr = "You're a bit chilly.";
    } else if (this.difference() < 100) {
      returnStr = "You're ice cold!";
    }
    return returnStr;
  }

  playersGuessSubmission(num) {
    let returnStr = "";
    let tempNum = isNaN(parseInt(num)) ? "invalid" : parseInt(num);

    if (!(typeof tempNum === "number" && tempNum <= 100 && tempNum >= 1)) {
      returnStr = "Error, invalide guess";
      throw "That is an invalid guess.";
    } else {
      this.playersGuess = tempNum;
      returnStr = this.checkGuess(tempNum);
      this.pastGuesses.push(tempNum);
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
