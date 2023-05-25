/* eslint-disable no-unused-vars */
/* eslint-disable */
const typingText = document.querySelector('.typing-text p'),
  inputField = document.querySelector('.wrapper .input-field'),
  timeTag = document.querySelector('.time span b'),
  mistakeTag = document.querySelector('.mistake span'),
  wpmTag = document.querySelector('.wpm span'),
  cpmTag = document.querySelector('.cpm span'),
  tryAgainbtn = document.querySelector('button');

let timer,
  maxTime = 60,
  timeLeft = maxTime,
  charIndex = mistakes = isTyping = 0

function randomParagraph() {
  // getting random number and it will always start than the paragraph
  let randIndex = Math.floor(Math.random() * paragraphs.length)
  typingText.innerHTML = "";
  // getting random item from the paragraphs array, splitting all charecters
  // of it adding each charecter inside sapn and then adding this inside p tag
  paragraphs[randIndex].split('').forEach(span => {
    spanTag = `<span>${span}</span>`
    typingText.innerHTML += spanTag
  })
  typingText.querySelectorAll('span')[0].classList.add('active')
  // focusing input field on keydown or click text
  document.addEventListener('keydown', () => inputField.focus())
  typingText.addEventListener('click', () => inputField.focus())
}

function initTyping() {
  const charecters = typingText.querySelectorAll('span')
  let typedChar = inputField.value.split('')[charIndex]
  if (charIndex < charecters.length - 1 && timeLeft > 0) {
    if (!isTyping) { //once timer is start, it wont restart again on every key clicked
      timer = setInterval(initTimer, 1000)
      isTyping = true
    }

    isTyping = true;
    // if user hasent entered any charecter or pressed backspace
    if (typedChar == null) {
      charIndex-- //decrement charIdex
      //document mistakes only if the charIndex span contains inocrrect class
      if (charecters[charIndex].classList.contains('incorrect')) {
        mistakes--
      }
      charecters[charIndex].classList.remove('correct', 'incorrect')
    } else {
      if (charecters[charIndex].innerText === typedChar) {
        // if user typed charecter and shown charecter matched the and
        // correct class else increment the mistakes  add the incorrect class
        charecters[charIndex].classList.add("correct")
      } else {
        mistakes++
        charecters[charIndex].classList.add("incorrect")
      }
      charIndex++ // increment chaindex either user typed correct or wrong
    }

    charecters.forEach(span => span.classList.remove('active'))
    charecters[charIndex].classList.add('active')

    let wpm = Math.round((((charIndex - mistakes) / 5) / (maxTime - timeLeft)) * 60);
    //if wpm value is 0, empty, or infinity then setting it is value to 0
    wpm = wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm;

    mistakeTag.innerText = mistakes;
    wpmTag.innerText = wpm;
    cpmTag.innerText = charIndex - mistakes; //cpm will not count mistakes
  } else {
    inputField.value = ""
    clearInterval(timer)
  }


}

function initTimer() {
  if (timeLeft > 0) {
    timeLeft--;
    timeTag.innerText = timeLeft;
  } else {
    clearInterval(timer)
  }
}

//function of trybtn
function reseGame() {
  //calling loadParagraph function and
  //resetting each variable and elements value to default
  randomParagraph();
  inputField.value = "";
  clearInterval(timer);
  timeLeft = maxTime;
  charIndex = mistakes = isTyping = 0;
  timeTag.innerText = timeLeft;
  mistakeTag.innerText = mistakes;
  wpmTag.innerText = 0;
  cpmTag.innerText = 0;
}
randomParagraph()
inputField.addEventListener('input', initTyping)
tryAgainbtn.addEventListener('click', reseGame)