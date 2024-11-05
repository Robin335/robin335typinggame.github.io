/* eslint-disable no-unused-vars */
/* eslint-disable */
const typingText = document.querySelector('.typing-text p'),
  inputField = document.querySelector('.wrapper .input-field'),
  timeTag = document.querySelector('.time span b'),
  mistakeTag = document.querySelector('.mistake span'),
  accuracyTag = document.querySelector('.accuracy span'),
  wpmTag = document.querySelector('.wpm span'),
  cpmTag = document.querySelector('.cpm span'),
  tryAgainbtn = document.querySelector('button'),
  progressBar = document.querySelector('.progress'),
  maxTime = 60;

let timer,
  timeLeft = maxTime,
  charIndex = 0,
  mistakes = 0,
  isTyping = false;

// Level criteria for passing
const levelCriteria = {
  easy: { minWPM: 30, minAccuracy: 80 },
  medium: { minWPM: 50, minAccuracy: 85 },
  hard: { minWPM: 70, minAccuracy: 90 },
  expert: { minWPM: 90, minAccuracy: 92 },
  master: { minWPM: 110, minAccuracy: 95 }
};

// Function to get selected difficulty level
function getSelectedLevel() {
  const levels = document.getElementsByName('level');
  for (const level of levels) {
    if (level.checked) {
      return level.value;
    }
  }
}

// Function to set a specific level
function setLevel(level) {
  const levels = document.getElementsByName('level');
  for (const levelElement of levels) {
    if (levelElement.value === level) {
      levelElement.checked = true;
      break;
    }
  }
}

// Function to select a random paragraph based on the selected level
function randomParagraph() {
  const selectedLevel = getSelectedLevel();
  const selectedParagraphs = paragraphs[selectedLevel];
  let randIndex = Math.floor(Math.random() * selectedParagraphs.length);
  typingText.innerHTML = "";
  selectedParagraphs[randIndex].split('').forEach(span => {
    const spanTag = `<span>${span}</span>`;
    typingText.innerHTML += spanTag;
  });
  typingText.querySelectorAll('span')[0].classList.add('active');
}

// Function to check if the user has passed the level
function checkLevelPass() {
  const selectedLevel = getSelectedLevel();
  const criteria = levelCriteria[selectedLevel];

  let wpm = Math.round((((charIndex - mistakes) / 5) / (maxTime - timeLeft)) * 60);
  let accuracy = Math.round(((charIndex - mistakes) / charIndex) * 100) || 0;

  if (wpm >= criteria.minWPM && accuracy >= criteria.minAccuracy) {
    notifyUser(`Congratulations! You've passed the level!`);
    advanceToNextLevel();
  } else {
    notifyUser(`You did not pass the ${selectedLevel} level. Try again!`);
  }
}

// Function to notify the user
function notifyUser(message) {
  const achievementMessage = document.querySelector('.achievement-message');
  achievementMessage.innerText = message;
  achievementMessage.classList.add('show');

  setTimeout(() => {
    achievementMessage.classList.remove('show');
    achievementMessage.innerText = '';
  }, 3000);
}

// Function to advance to the next level
function advanceToNextLevel() {
  const levels = ['easy', 'medium', 'hard', 'expert', 'master'];
  const currentLevelIndex = levels.indexOf(getSelectedLevel());

  if (currentLevelIndex < levels.length - 1) {
    const nextLevel = levels[currentLevelIndex + 1];
    setLevel(nextLevel);
    notifyUser(`You are now at the ${nextLevel} level!`);
    resetGame(); // Reset game for the next level
  } else {
    notifyUser("You've reached the highest level!");
  }
}

// Function to initialize typing
function initTyping() {
  const characters = typingText.querySelectorAll('span');
  let typedChar = inputField.value.split('')[charIndex];

  if (charIndex < characters.length - 1 && timeLeft > 0) {
    if (!isTyping && inputField.value.length > 0) {
      timer = setInterval(initTimer, 1000);
      isTyping = true;
    }

    if (typedChar == null) {
      charIndex--;
      if (characters[charIndex].classList.contains('incorrect')) {
        mistakes--;
      }
      characters[charIndex].classList.remove('correct', 'incorrect');
    } else {
      if (characters[charIndex].innerText === typedChar) {
        characters[charIndex].classList.add("correct");
      } else {
        mistakes++;
        characters[charIndex].classList.add("incorrect");
      }
      charIndex++;
    }

    characters.forEach(span => span.classList.remove('active'));
    if (charIndex < characters.length) {
      characters[charIndex].classList.add('active');
    }

    let wpm = Math.round((((charIndex - mistakes) / 5) / (maxTime - timeLeft)) * 60);
    wpm = wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm;

    let cpm = charIndex - mistakes;

    timeTag.innerText = timeLeft;
    mistakeTag.innerText = mistakes;
    accuracyTag.innerText = Math.round(((charIndex - mistakes) / charIndex) * 100) || 0;
    wpmTag.innerText = wpm;
    cpmTag.innerText = cpm;
  } else {
    clearInterval(timer);
    inputField.disabled = true;
    checkLevelPass();
  }
}

// Function to initialize the timer
function initTimer() {
  if (timeLeft > 0) {
    timeLeft--;
    progressBar.style.width = (maxTime - timeLeft) / maxTime * 100 + '%';
    if (timeLeft === 0) {
      clearInterval(timer);
      inputField.disabled = true;
      checkLevelPass();
    }
  }
}

// Function to reset the game
function resetGame() {
  charIndex = 0;
  mistakes = 0;
  timeLeft = maxTime;
  isTyping = false;
  randomParagraph();
  inputField.value = '';
  clearInterval(timer);
  timeTag.innerHTML = maxTime;
  mistakeTag.innerText = 0;
  accuracyTag.innerText = 100;
  wpmTag.innerText = 0;
  cpmTag.innerText = 0;
  progressBar.style.width = '0%';
  inputField.disabled = false;
  inputField.focus();
}

// Initialize the game with a random paragraph
randomParagraph();

// Add event listeners
inputField.addEventListener('input', initTyping);
tryAgainbtn.addEventListener('click', resetGame);

// Event listener for the Start Game button
document.getElementById('start-game-btn').addEventListener('click', () => {
  resetGame();
  randomParagraph();
});
