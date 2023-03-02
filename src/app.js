/* eslint-disable import/no-extraneous-dependencies */
import * as yup from 'yup';
import onChange from 'on-change';
import axios from 'axios';
import i18next from 'i18next';
import locales from './locales/index.js';
import parse from './utils/parser.js';
import render from './view.js';

const validate = (newURL, list) => {
  const schema = yup.string().trim().url().notOneOf(list);
  return schema.validate(newURL);
};

const getResponse = (url) => {
  const allOriginsLink = 'https://allorigins.hexlet.app/get';
  const preparedURL = new URL(allOriginsLink);
  preparedURL.searchParams.set('disableCache', 'true');
  preparedURL.searchParams.set('url', url);
  return axios.get(preparedURL);
};

const addFeeds = (parsedFeed, link, watchedState) => {
  watchedState.data.feeds.push({ ...parsedFeed, link });
};

const addPosts = (posts, watchedState) => {
  const preparedPosts = posts.map((post) => ({ ...post }));
  watchedState.data.posts = preparedPosts.concat(watchedState.data.posts);
};

const app = () => {
  const i18nextInstance = i18next.createInstance();
  i18nextInstance.init({
    lng: 'ru',
    debug: true,
    locales,
  })
    .then(() => {
      const state = {
        inputData: '',
        addingRssProcess: {
          state: 'filling',
          error: '',
        },
        data: {
          feeds: [],
          posts: [],
        },
      };

      yup.setLocale({
        mixed: {
          notOneOf: 'rssAlreadyExists',
          defaultError: 'dataIsNotValid',
        },
        string: {
          url: 'notValidURL',
        },
      });

      const elements = {
        form: document.querySelector('form'),
        input: document.querySelector('input'),
        btn: document.querySelector('button[type="submit"]'),
        feedback: document.querySelector('.feedback'),
        posts: document.querySelector('.posts'),
        feeds: document.querySelector('.feeds'),
      };

      const watchedState = onChange(state, render(state, elements, i18nextInstance));
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
            const parsedRSS = parse(response.data.contents);
            addFeeds(parsedRSS.feed, state.inputData, watchedState);
            addPosts(parsedRSS.posts, watchedState);
            console.log(parsedRSS);
            feedList.push(state.inputData);
            watchedState.addingRssProcess.state = 'success';
          })
          .catch((error) => {
            watchedState.addingRssProcess.error = error;
            watchedState.addingRssProcess.state = 'failed';
            console.log(error);
            console.log(watchedState.addingRssProcess.state);
            console.log(elements.input.classList);
            console.log(elements.feedback);
          });
      });
    });
};

export default app;
