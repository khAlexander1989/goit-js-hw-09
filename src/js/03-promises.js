import { Notify } from 'notiflix/build/notiflix-notify-aio';

import 'notiflix/dist/notiflix-3.2.5.min.css';

const refs = {
  form: document.querySelector('.form'),
};

//------------------------------FUNCTIONS------------------------------

function createPromise(position, delay) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const shouldResolve = Math.random() > 0.3;
      if (shouldResolve) {
        resolve({ position, delay });
      } else {
        reject({ position, delay });
      }
    }, delay);
  });
}

function createPromiseSet(delay, step, amount) {
  for (let i = 1; i <= amount; i++) {
    createPromise(i, delay)
      .then(({ position, delay }) => {
        Notify.success(`✅ Fulfilled promise ${position} in ${delay}ms`);
      })
      .catch(({ position, delay }) => {
        Notify.failure(`❌ Rejected promise ${position} in ${delay}ms`);
      });

    delay += step;
  }
}

function getFormData(form) {
  const data = {};

  new FormData(form).forEach((value, name) => {
    data[name] = Number(value);
  });

  return data;
}

//------------------------------EVENT LISTENERS------------------------------

refs.form.addEventListener('submit', onFormSubmit);

//------------------------------EVENT HANDLERS------------------------------

function onFormSubmit(event) {
  event.preventDefault();

  let { delay, step, amount } = getFormData(event.currentTarget);

  if (amount <= 0) {
    return;
  }

  createPromiseSet(delay, step, amount);

  event.currentTarget.reset();
}
