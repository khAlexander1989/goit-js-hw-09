const refs = {
  body: document.body,
  startBtn: document.querySelector('[data-start]'),
  stopBtn: document.querySelector('[data-stop]'),
};

let bgColorChangeIntervalId = null;
let isBgColorChangeEnabled = false;

//--------------------FUNCTIONS--------------------

function getRandomHexColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}

function changeBgColor(element) {
  element.style.backgroundColor = getRandomHexColor();
}

//--------------------EVENT LISTENERS--------------------

refs.startBtn.addEventListener('click', onStartBtnClick);
refs.stopBtn.addEventListener('click', onStopBtnClick);

//--------------------EVENT HANDLERS--------------------

function onStartBtnClick() {
  bgColorChangeIntervalId = setInterval(changeBgColor, 1000, refs.body);

  isBgColorChangeEnabled = true;
  refs.startBtn.setAttribute('disabled', true);
}

function onStopBtnClick() {
  if (!isBgColorChangeEnabled) {
    return;
  }

  clearInterval(bgColorChangeIntervalId);
  refs.startBtn.removeAttribute('disabled');
}
