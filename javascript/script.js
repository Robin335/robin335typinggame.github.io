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
  progressBar = document.querySelector('.progress');

let timer,
  maxTime = 60,
  timeLeft = maxTime,
  charIndex = mistakes = isTyping = 0;

function randomParagraph() {
  let randIndex = Math.floor(Math.random() * paragraphs.length);
  typingText.innerHTML = "";
  paragraphs[randIndex].split('').forEach(span => {
    spanTag = `<span>${span}</span>`;
    typingText.innerHTML += spanTag;
  });
  typingText.querySelectorAll('span')[0].classList.add('active');
  document.addEventListener('keydown', () => inputField.focus());
  typingText.addEventListener('click', () => inputField.focus());
}

function initTyping() {
  const characters = typingText.querySelectorAll('span');
  let typedChar = inputField.value.split('')[charIndex];

  if (charIndex < characters.length - 1 && timeLeft > 0) {
    if (!isTyping) {
      timer = setInterval(initTimer, 1000);
      isTyping = true;
    }

    if (typedChar == null) {
      if (characters[charIndex].classList.contains('incorrect')) mistakes--;
      characters[charIndex].classList.remove('correct', 'incorrect');
      charIndex--;
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
    characters[charIndex].classList.add('active');

    let wpm = Math.round((((charIndex - mistakes) / 5) / (maxTime - timeLeft)) * 60);
    wpm = wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm;

    let accuracy = Math.round(((charIndex - mistakes) / charIndex) * 100);
    accuracy = isNaN(accuracy) || accuracy < 0 ? 100 : accuracy;

    mistakeTag.innerText = mistakes;
    wpmTag.innerText = wpm;
    cpmTag.innerText = charIndex - mistakes;
    accuracyTag.innerText = `${accuracy}%`;
  } else {
    inputField.value = "";
    clearInterval(timer);
  }
}

function initTimer() {
  if (timeLeft > 0) {
    timeLeft--;
    timeTag.innerText = timeLeft;

    progressBar.style.width = `${(timeLeft / maxTime) * 100}%`;
    if (timeLeft < 10) {
      timeTag.parentElement.classList.add('warning');
    } else {
      timeTag.parentElement.classList.remove('warning');
    }
  } else {
    clearInterval(timer);
  }
}

function resetGame() {
  randomParagraph();
  inputField.value = "";
  clearInterval(timer);
  timeLeft = maxTime;
  charIndex = mistakes = isTyping = 0;
  timeTag.innerText = timeLeft;
  progressBar.style.width = "100%";
  mistakeTag.innerText = mistakes;
  wpmTag.innerText = 0;
  cpmTag.innerText = 0;
  accuracyTag.innerText = "100%";
  timeTag.parentElement.classList.remove('warning');
}

randomParagraph();
inputField.addEventListener('input', initTyping);
tryAgainbtn.addEventListener('click', resetGame);
