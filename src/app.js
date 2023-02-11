/* eslint-disable import/no-extraneous-dependencies */
import * as yup from 'yup';
import onChange from 'on-change';
import axios from 'axios';
import render from './view.js';

const validate = (newURL, list) => {
  const schema = yup.string()
    .url()
    .notOneOf(list)
    .trim();
  return schema.validate(newURL);
};

const getResponse = (url) => axios.get(url);

const app = () => {
  const state = {
    inputData: '',
    addingRssProcess: {
      state: 'filling',
      error: '',
    },
    data: {
      feeds: [],
    },
  };

  const elements = {
    form: document.querySelector('form'),
    input: document.querySelector('input'),
    feedback: document.querySelector('.feedback'),
  };

  const watchedState = onChange(state, render(state, elements));
  elements.form.addEventListener('input', (e) => {
    e.preventDefault();
    watchedState.inputData = e.target.value;
  });

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const feedList = state.data.feeds;

    validate(state.inputData, feedList)
      .then(() => {
        watchedState.addingRssProcess.state = 'sending';
        return getResponse(state.inputData);
      })
      .then((response) => console.log(response))
      .catch((error) => {
        console.log(error);
        watchedState.addingRssProcess.state = 'failed';
      });

    console.log('0');
  });
};

export default app;
