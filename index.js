const gridContainer = document.querySelector(".grid-container");
let cards = [];
let firstCard, secondCard;
let lockBoard = false;
let score = 0;
let timerInterval;
let timeRemaining = 60; // in seconds

document.querySelector(".score").textContent = score;
document.querySelector(".timer").textContent = timeRemaining;

fetch("./data/cards.json")
  .then((res) => res.json())
  .then((data) => {
    cards = [...data, ...data];
    shuffleCards();
    generateCards();
    startTimer();
  });

function startTimer() {
  timerInterval = setInterval(() => {
    timeRemaining--;
    document.querySelector(".timer").textContent = timeRemaining;

    if (timeRemaining === 0) {
      clearInterval(timerInterval);
      handleGameOver();
    }
  }, 1000);
}

function handleGameOver() {
  lockBoard = true; // Prevent further interactions
  alert("Time's up! Game Over.");
}

function shuffleCards() {
  let currentIndex = cards.length,
    randomIndex,
    temporaryValue;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = cards[currentIndex];
    cards[currentIndex] = cards[randomIndex];
    cards[randomIndex] = temporaryValue;
  }
}

function generateCards() {
  for (let card of cards) {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.setAttribute("data-name", card.name);
    cardElement.innerHTML = `
      <div class="front">
        <img class="front-image" src=${card.image} />
      </div>
      <div class="back"></div>
    `;
    gridContainer.appendChild(cardElement);
    cardElement.addEventListener("click", flipCard);
  }
}

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add("flipped");

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  lockBoard = true;

  checkForMatch();
}

function checkForMatch() {
  let isMatch = firstCard.dataset.name === secondCard.dataset.name;

  isMatch ? disableCards() : unflipCards();
}

function disableCards() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);

  score++;
  document.querySelector(".score").textContent = score;

  if (score === 9) {
    clearInterval(timerInterval);
    lockBoard = true; // Prevent further interactions
    alert("Congratulations! You've got the maximum score!\nGame Over.");
  } else {
    resetBoard();
  }
}

function unflipCards() {
  setTimeout(() => {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    resetBoard();
  }, 1000);
}

function resetBoard() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

function restart() {
  resetBoard();
  clearInterval(timerInterval);
  timeRemaining = 60;
  document.querySelector(".timer").textContent = timeRemaining;
  shuffleCards();
  score = 0;
  document.querySelector(".score").textContent = score;
  gridContainer.innerHTML = "";
  generateCards();
  startTimer();
}
