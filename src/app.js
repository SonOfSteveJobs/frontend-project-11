/* eslint-disable import/no-extraneous-dependencies */
import * as yup from 'yup';
import onChange from 'on-change';
import axios from 'axios';
import render from './view.js';

const validate = (newURL, list) => {
  const schema = yup.string()
    .trim()
    .url()
    .notOneOf(list);
  return schema.validate(newURL);
};

const getResponse = (url) => {
  const allOriginsLink = 'https://allorigins.hexlet.app/get';
  const preparedURL = new URL(allOriginsLink);
  preparedURL.searchParams.set('disableCache', 'true');
  preparedURL.searchParams.set('url', url);
  return axios.get(preparedURL);
};

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
    btn: document.querySelector('button[type="submit"]'),
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
        console.log(feedList);
        return getResponse(state.inputData);
      })
      .then((response) => {
        console.log(response);
        feedList.push(state.inputData);
        watchedState.addingRssProcess.state = 'success';
        return response.data;
      })
      .then((str) => new window.DOMParser().parseFromString(str, 'text/xml'))
      .then((data) => {
        const rootTagName = data.documentElement.tagName.toLowerCase();
        if (rootTagName !== 'rss') {
          throw new Error('noRSS');
        }
      })
      .catch((error) => {
        watchedState.addingRssProcess.error = error;
        watchedState.addingRssProcess.state = 'failed';
        console.log(error);
        console.log(watchedState.addingRssProcess.state);
        console.log(elements.input.classList);
      });
  });
};

export default app;
