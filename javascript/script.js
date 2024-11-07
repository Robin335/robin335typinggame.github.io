/* eslint-disable no-unused-vars */
/* eslint-disable */

// Select DOM elements
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

// Initialize variables
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
  master: { minWPM: 110, minAccuracy: 95}
};

// Load sound files
const startSound = new Audio('sounds/startGame.mp3');
const mistakeSound = new Audio('sounds/mistake.mp3');
const passLevelSound = new Audio('sounds/passLevel.mp3');
const failLevelSound = new Audio('sounds/failLevel.mp3'); // Optional
const levelUpSound = new Audio('sounds/levelUp.mp3'); // Optional
const backgroundMusic = new Audio('sounds/backgroundMusic.mp3');
backgroundMusic.loop = true; // Set the music to loop
backgroundMusic.volume = 0.5; // Set the volume to a reasonable level (adjust as needed)

// Preload sounds
startSound.preload = 'auto';
mistakeSound.preload = 'auto';
passLevelSound.preload = 'auto';
failLevelSound.preload = 'auto';
levelUpSound.preload = 'auto';


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
// JavaScript to change color when a level is selected
const levelLabels = document.querySelectorAll('.level-selection label');

levelLabels.forEach(label => {
    label.addEventListener('click', () => {
        // Remove the selected class from all labels
        levelLabels.forEach(item => item.classList.remove('selected'));
        
        // Add the selected class to the clicked label
        label.classList.add('selected');
    });
});

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
    passLevelSound.play(); // Play pass level sound
    advanceToNextLevel();
  } else {
    notifyUser(`You did not pass the ${selectedLevel} level. Start Again!`);
    failLevelSound.play(); // Play fail level sound (Optional)
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
    levelUpSound.play(); // Play level up sound (Optional)
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
        playMistakeSound(); // Play sound when a mistake is made
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

// Function to play mistake sound
function playMistakeSound() {
  mistakeSound.currentTime = 0; // Reset sound in case it's still playing
  mistakeSound.play();
}

// Initialize the game with a random paragraph
randomParagraph();

// Add event listeners
inputField.addEventListener('input', initTyping);
tryAgainbtn.addEventListener('click', resetGame);

// Event listener for the Start Game button
document.getElementById('start-game-btn').addEventListener('click', () => {
  displayLevelRequirements(); // Display requirements at the start of the game
  startSound.play(); // Play start game sound
  resetGame();
  randomParagraph();
});

// Function to display level requirements based on the selected level
function displayLevelRequirements() {
  const selectedLevel = getSelectedLevel();
  const criteria = levelCriteria[selectedLevel];
  
  const levelCriteriaDisplay = document.getElementById('level-criteria');
  levelCriteriaDisplay.innerText = `WPM: ${criteria.minWPM} | Accuracy: ${criteria.minAccuracy}%`;
}

// Update requirements immediately when level selection changes
document.querySelectorAll('input[name="level"]').forEach(levelInput => {
  levelInput.addEventListener('change', displayLevelRequirements);
});

// Track mute status
let isMuted = false;

// Select the mute button and add event listener
const muteBtn = document.getElementById('mute-btn');
muteBtn.addEventListener('click', () => {
    isMuted = !isMuted; // Toggle mute state
    muteBtn.innerText = isMuted ? 'Unmute' : 'Mute'; // Update button text

    if (isMuted) {
        console.log("Sounds are muted.");
    } else {
        console.log("Sounds are unmuted.");
    }
});

// Function to play sound only if not muted
function playSound(sound) {
    if (!isMuted) {
        sound.currentTime = 0; // Reset sound in case it's still playing
        sound.play();
    }
}

// Function to play mistake sound
function playMistakeSound() {
    playSound(mistakeSound);
}

// Modify your other sound-playing functions similarly
function checkLevelPass() {
    const selectedLevel = getSelectedLevel();
    const criteria = levelCriteria[selectedLevel];

    let wpm = Math.round((((charIndex - mistakes) / 5) / (maxTime - timeLeft)) * 60);
    let accuracy = Math.round(((charIndex - mistakes) / charIndex) * 100) || 0;

    if (wpm >= criteria.minWPM && accuracy >= criteria.minAccuracy) {
        notifyUser(`Congratulations! You've passed the level!`);
        playSound(passLevelSound); // Use playSound here
        advanceToNextLevel();
    } else {
        notifyUser(`You did not pass the ${selectedLevel} level. Start Again!`);
        playSound(failLevelSound); // Use playSound here
    }
}

// Play sound on level up or pass
function advanceToNextLevel() {
    const levels = ['easy', 'medium', 'hard', 'expert', 'master'];
    const currentLevelIndex = levels.indexOf(getSelectedLevel());

    if (currentLevelIndex < levels.length - 1) {
        const nextLevel = levels[currentLevelIndex + 1];
        setLevel(nextLevel);
        notifyUser(`You are now at the ${nextLevel} level!`);
        playSound(levelUpSound); // Use playSound here
        resetGame(); // Reset game for the next level
    } else {
        notifyUser("You've reached the highest level!");
    }
}

// Modify your start game function to check for mute
document.getElementById('start-game-btn').addEventListener('click', () => {
    displayLevelRequirements(); // Display requirements at the start of the game
    if (!isMuted) {
        startSound.play(); // Play start sound only if not muted
    }
    resetGame();
    randomParagraph();
});

// Function to play sound only if not muted
function playSound(sound) {
    if (!isMuted) {
        sound.currentTime = 0; // Reset sound in case it's still playing
        sound.play();
    }
}

// Select user name input
const usernameInput = document.getElementById('username');

// Track player information
let playerName = '';

// Event listener to start the game and capture the name
document.getElementById('start-game-btnz').addEventListener('click', () => {
  playerName = usernameInput.value.trim();
  
  if (playerName === '') {
    alert('Please enter your name before starting the game.');
    return;
  }

  displayLevelRequirements(); // Display requirements at the start of the game
  if (!isMuted) {
    startSound.play(); // Play start sound only if not muted
  }
  resetGame();
  randomParagraph();
});


// Store the user's results
let results = {
  name: '',
  level: '',
  wpm: 0,
  accuracy: 0,
  timeSpent: 0,
  mistakes: 0
};


// Function to display result details in a modal
function displayResults() {
  // Store the results
  const resultMessage = `Player: ${results.name}\n` +
                        `Level: ${results.level}\n` +
                        `WPM: ${results.wpm}\n` +
                        `Accuracy: ${results.accuracy}%\n` +
                        `Mistakes: ${results.mistakes}\n` +
                        `Time Spent: ${results.timeSpent}s`;

  console.log(resultMessage); // You can output to the console or generate a certificate from this data.

  // Update the DOM elements inside the modal to show the results
  document.getElementById('player-name').textContent = `Name: ${results.name}`;
  document.getElementById('player-level').textContent = `Level: ${results.level}`;
  document.getElementById('player-wpm').textContent = `WPM: ${results.wpm}`;
  document.getElementById('player-accuracy').textContent = `Accuracy: ${results.accuracy}%`;
  document.getElementById('player-mistakes').textContent = `Mistakes: ${results.mistakes}`;
  document.getElementById('player-time').textContent = `Time Spent: ${results.timeSpent}s`;

  // Display the modal
  const modal = document.getElementById('resultsModal');
  modal.style.display = "block";
}

// Event listener for closing the modal
document.getElementById('close-modal-btn').addEventListener('click', function() {
  const modal = document.getElementById('resultsModal');
  modal.style.display = "none";
});


function checkLevelPass() {
  const selectedLevel = getSelectedLevel();
  const criteria = levelCriteria[selectedLevel];

  // Calculate WPM and accuracy
  let wpm = Math.round((((charIndex - mistakes) / 5) / (maxTime - timeLeft)) * 60);
  let accuracy = Math.round(((charIndex - mistakes) / charIndex) * 100) || 0;

  // Store the results
  results.name = playerName;
  results.level = selectedLevel;
  results.wpm = wpm;
  results.accuracy = accuracy;
  results.mistakes = mistakes;
  results.timeSpent = maxTime - timeLeft;

  if (wpm >= criteria.minWPM && accuracy >= criteria.minAccuracy) {
    notifyUser(`Congratulations, ${playerName}! You've passed the level!`);
    playSound(passLevelSound);
    displayResults(); // Display results after passing each level
    advanceToNextLevel();
  } else {
    notifyUser(`Sorry, ${playerName}. You did not pass the ${selectedLevel} level. Start Again!`);
    playSound(failLevelSound);
  }
}

function advanceToNextLevel() {
  const levels = ['easy', 'medium', 'hard', 'expert', 'master'];
  const currentLevelIndex = levels.indexOf(getSelectedLevel());

  if (currentLevelIndex < levels.length - 1) {
    const nextLevel = levels[currentLevelIndex + 1];
    setLevel(nextLevel);
    notifyUser(`You are now at the ${nextLevel} level!`);
    playSound(levelUpSound);
    resetGame();
  } else {
    notifyUser(`${playerName}, you've reached the highest level!`);
  }
}
