const initState = (elements) => {
  elements.btn.disabled = false;
  elements.input.classList.remove('is-invalid');
  elements.input.focus();
  elements.form.reset();
};

const errorHandler = (elements, error) => {
  if (error !== 'Network Error') elements.input.classList.add('is-invalid');
  elements.btn.disabled = false;
};

const successHandler = (state, elements, i18nextInstance) => {
  initState(elements);
  elements.feedback.textContent = '';
  elements.feedback.classList.remove('text-danger');
  elements.feedback.classList.add('text-success');
  elements.feedback.textContent = i18nextInstance.t('rssAdded');
};

const render = (state, elements, i18nextInstance) => (path, value) => {
  console.log(path);
  console.log(value);
  switch (path) {
    case 'addingRssProcess.state':
      if (value === 'sending') {
        elements.btn.disabled = true;
      }
      if (value === 'failed') {
        errorHandler(elements, state.addingRssProcess.error);
      }
      if (value === 'success') {
        successHandler(state, elements, i18nextInstance);
      }
      break;
    default:
      break;
  }
};

export default render;
