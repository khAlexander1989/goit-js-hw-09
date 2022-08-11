import EventEmitter from 'events';
import flatpickr from 'flatpickr';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

import 'flatpickr/dist/flatpickr.min.css';
import 'notiflix/dist/notiflix-3.2.5.min.css';

const refs = {
  dateTimePicker: document.querySelector('#datetime-picker'),
  startBtn: document.querySelector('[data-start]'),
  timer: {
    daysField: document.querySelector('[data-days]'),
    hoursField: document.querySelector('[data-hours]'),
    minutesField: document.querySelector('[data-minutes]'),
    secondsField: document.querySelector('[data-seconds]'),
  },
};

let targetDate = null;
const eventEmitter = new EventEmitter();

//--------------------------FLATPICKER & NOTIFY INIT OPTIONS--------------------------

const flatpickerOpts = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,

  onClose(selectedDates) {
    targetDate = selectedDates[0].getTime();

    if (targetDate <= Date.now()) {
      refs.startBtn.setAttribute('disabled', true);
      Notify.failure('Please choose a date in the future');
      return;
    }

    refs.startBtn.removeAttribute('disabled');
  },
};

const notifyOpts = {
  position: 'center-top',
  timeout: 2000,
  clickToClose: true,
};

//--------------------------FLATPICKER & NOTIFY INITIALIZATION--------------------------

flatpickr('#datetime-picker', flatpickerOpts);
Notify.init(notifyOpts);

//--------------------------CLASS TIMER--------------------------

class CountDownTimer {
  constructor(endTime = Date.now()) {
    this.endTime = endTime;
    this.restOfTime = 0;
    this.isEnabled = false;
    this.timerId = null;
  }

  start() {
    if (this.isEnabled) {
      return;
    }

    this.timerId = setInterval(this.updateTime.bind(this), 1000);
    this.isEnabled = true;
  }

  stop() {
    if (!this.isEnabled) {
      return;
    }

    clearInterval(this.timerId);
    this.isEnabled = false;
    eventEmitter.emit('timeStop');
  }

  updateTime() {
    this.restOfTime = this.endTime - Date.now();

    if (this.restOfTime < 0) {
      this.stop();
      return;
    }

    eventEmitter.emit('timeUpdate', this.restOfTime);
  }
}

//--------------------------FUNCTIONS--------------------------

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function renderTimer(time, timerElements) {
  const { daysField, hoursField, minutesField, secondsField } = timerElements;
  const { days, hours, minutes, seconds } = convertMs(time);

  daysField.textContent = addLeadingZero(days);
  hoursField.textContent = addLeadingZero(hours);
  minutesField.textContent = addLeadingZero(minutes);
  secondsField.textContent = addLeadingZero(seconds);
}

function addLeadingZero(value) {
  return value.toString().padStart(2, '0');
}

//--------------------------EVENT LISTENERS--------------------------

refs.startBtn.addEventListener('click', onStartBtnClick);
eventEmitter.on('timeUpdate', onTimeUpdate);
eventEmitter.on('timeStop', onTimeStop);

//--------------------------EVENT HANDLERS--------------------------

function onStartBtnClick(event) {
  const timer = new CountDownTimer(targetDate);
  timer.start();
  refs.dateTimePicker.setAttribute('disabled', true);
  refs.startBtn.setAttribute('disabled', true);
}

function onTimeUpdate(time) {
  renderTimer(time, refs.timer);
}

function onTimeStop() {
  refs.dateTimePicker.removeAttribute('disabled');
  refs.startBtn.removeAttribute('disabled');
}
