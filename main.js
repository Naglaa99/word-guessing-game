// Select and store key DOM elements for future use
let elements = {
  startPage: document.querySelector(".start-page"),
  startButton: document.querySelector(".start-play"),
  nameOfPlayer: document.querySelector(".player-name span"),
  tries: document.querySelector(".game-tries span"),
  inputsContainer: document.querySelector(".inputs"),
  guessButton: document.querySelector(".check"),
  hintButton: document.querySelector(".hint"),
  hintSpan: document.querySelector(".hint span"),
};

// Initialize the game state with default values
let gameState = {
  playerName: "",
  numberOfTries: 0,
  numberOfLetters: 0,
  currentTry: 1,
  wordToGuess: "",
  successGuess: true,
  wordList: [
    "apple", "house", "plant", "snake", "grape", "chair", "table",
    "light", "train", "bread", "melon", "cloud", "stone", "brush",
    "brick", "flame", "plate", "drain", "flock", "paper",
  ],
  letter: "",
  correctLetter: "",
  numberOfHints: 2,
};


elements.startButton.addEventListener("click", startGame);

// Function to initialize and start the game
function startGame() {
  gameState.playerName = prompt("please ,Enter your Name");
  gameState.numberOfTries = getValidNumbersOfTries();
  updateUIWithPlayerInfo();
  elements.startPage.remove();
  generateInputs();
}

// Function to get a valid number of tries from the player
function getValidNumbersOfTries() {
  let numberOfTries;
  do {
    numberOfTries = prompt("How many tries? (Max: 5)");
    if (numberOfTries > 5 || numberOfTries <= 0) {
      alert("Please enter a number between 1 and 5.");
    }
  } while (numberOfTries > 5 || numberOfTries <= 0);

  return numberOfTries;
}

// Function to update UI elements with player's info (name and tries)
function updateUIWithPlayerInfo() {
  elements.nameOfPlayer.innerHTML = gameState.playerName || "Guest";
  elements.tries.innerHTML = gameState.numberOfTries ;
}

// Function to generate input fields for the player's guesses
function generateInputs() {
  for (let i = 1; i <= gameState.numberOfTries; i++) {

    let guessContainer = document.createElement("div");
    let tryText = document.createElement("span");

    guessContainer.classList.add(
      `try-${i}`,
      "flex",
      "justify-center",
      "items-center",
      "mb-4"
    );

    tryText.textContent = `Try ${i}`;

    tryText.classList.add(
      "text-[25px]",
      "md:mr-6",
      "sm:mr-4",
      "font-bold",
      "text-white"
    );

    if (i !== 1)
      guessContainer.classList.add(
        "disabled-inputs",
        "pointer-events-none",
        "opacity-50"
      );

    guessContainer.appendChild(tryText);
    elements.inputsContainer.appendChild(guessContainer);

    for (let j = 1; j <= gameState.numberOfLetters; j++) {
      const input = document.createElement("input");

      input.classList.add(
        "md:mx-2", "sm:mx-1", "mx-2", "w-[32px]", "h-[32px]", "lg:w-[50px]",
        "lg:h-[50px]", "md:w-[40px]", "md:h-[40px]", "sm:w-[35px]", "sm:h-[35px]",
        "text-center", "md:text-[35px]", "sm:text-[30px]", "text-[24px]",
        "caret-cyan-500", "border-b-4", "border-solid", "border-b-cyan-600",
        "focus:outline-gray-400", "uppercase"
      );

      input.type = "text";
      input.id = `guess${i}-letter${j}`;
      input.setAttribute("maxlength", "1");
      input.addEventListener("input", () => {
        const nextInput = input.nextElementSibling;
        if (nextInput) nextInput.focus();
      });

      guessContainer.appendChild(input);
    }
  }

  // Focus on the first input field when game starts
  elements.inputsContainer.children[0].children[1].focus();

  // Disable All Inputs Except First One
  const inputsInDisabledDiv = document.querySelectorAll(
    ".disabled-inputs input"
  );

  inputsInDisabledDiv.forEach((input) => input.setAttribute("disabled", true));
}

// Randomly select a word from the word list and set it as the word to guess
gameState.wordToGuess =
  gameState.wordList[
    Math.floor(Math.random() * gameState.wordList.length)
  ].toLowerCase();
gameState.numberOfLetters = gameState.wordToGuess.length;

elements.guessButton.addEventListener("click", handleGuesses);
// Function to handle the player's guesses and check if they are correct
function handleGuesses() {
  gameState.successGuess = true;

  for (let i = 1; i <= gameState.numberOfLetters; i++) {

    const inputField = document.querySelector(
      `#guess${gameState.currentTry}-letter${i}`
    );

    gameState.letter = inputField.value.toLowerCase();
    gameState.correctLetter = gameState.wordToGuess[i - 1];

    // Validate and style the input field based on the player's guess
    if (!gameState.letter) {
      inputField.classList.add("bg-rose-800");
      gameState.successGuess = false;
    } else if (gameState.correctLetter == gameState.letter) {
      inputField.classList.add("bg-emerald-500", "text-white");
    } else if (gameState.wordToGuess.includes(gameState.letter)) {
      inputField.classList.add("bg-amber-500", "text-white");
      gameState.successGuess = false;
    } else {
      inputField.classList.add("bg-rose-800", "text-white");
      gameState.successGuess = false;
    }
  }

  // If the player guessed the word correctly, show success message
  if (gameState.successGuess) {
    setTimeout(() => {
      Swal.fire({
        title: `Congratulations 🎉 <span class="text-sky-700  >${gameState.playerName}</span>!`,
        html: `You guessed the word: <span class="text-green-700 font-bold ">${gameState.wordToGuess}</span>`,
        icon: "success",
        confirmButtonText: "Play Again",
      }).then(() => location.reload());
    }, 500);
  } else {

    // If the guess was incorrect, disable the current try and move to the next one
    document
      .querySelector(`.try-${gameState.currentTry}`)
      .classList.add("disabled-inputs", "pointer-events-none", "opacity-50");

    let currentTryInputs = document.querySelectorAll(
      `.try-${gameState.currentTry} input`
    );

    currentTryInputs.forEach((input) => input.setAttribute("disabled", true));

    gameState.currentTry++;
    let nextTryInputs = document.querySelectorAll(
      `.try-${gameState.currentTry} input`
    );
    nextTryInputs.forEach((input) => input.removeAttribute("disabled"));

    let nextTryElement = document.querySelector(`.try-${gameState.currentTry}`);

    if (nextTryElement) {
      nextTryElement.classList.remove(
        "disabled-inputs",
        "pointer-events-none",
        "opacity-50"
      );
      nextTryElement.querySelector("input").focus();
    } else {
      
      // If no tries left, show game over message
      setTimeout(() => {
        Swal.fire({
          title: "Game Over 😞",
          html: `You've used all your tries!<br>The correct word was: <span class="text-red-600 font-bold">${gameState.wordToGuess}</span>`,
          icon: "error",
          confirmButtonText: "Try Again",
        }).then(() => location.reload());
      }, 500);
    }
  }
}

elements.hintSpan.innerHTML = gameState.numberOfHints;
elements.hintButton.addEventListener("click", getHint);

// Function to provide a hint by filling a random empty input with a correct letter
function getHint() {
  if (gameState.numberOfHints > 0) {
    gameState.numberOfHints--;
    elements.hintSpan.innerHTML = gameState.numberOfHints;
  }

  if (gameState.numberOfHints == 0) {
    elements.hintButton.classList.add("pointer-events-none", "opacity-50");
  }
  fillRandomEmptyInput();
}

// Function to fill a random empty input with the correct letter
function fillRandomEmptyInput() {
  const enabledInputs = document.querySelectorAll("input:not([disabled])");
  const emptyEnabledInputs = Array.from(enabledInputs).filter(
    (input) => input.value === ""
  );

  if (emptyEnabledInputs.length > 0) {
    const randomIndex = Math.floor(Math.random() * emptyEnabledInputs.length);
    const randomInput = emptyEnabledInputs[randomIndex];
    const indexToFill = Array.from(enabledInputs).indexOf(randomInput);
    if (indexToFill !== -1) {
      randomInput.value = gameState.wordToGuess[indexToFill].toUpperCase();
    }
  }
}

function handleBackSpace(event) {
  if (event.key === "Backspace") {
    const inputs = document.querySelectorAll("input:not([disabled]");
    const currentIndex = Array.from(inputs).indexOf(document.activeElement);

    if (currentIndex > 0) {
      inputs[currentIndex].value = "";
      inputs[currentIndex - 1].value = "";
      inputs[currentIndex - 1].focus();
    }

  }
}

document.addEventListener("keydown", handleBackSpace);
