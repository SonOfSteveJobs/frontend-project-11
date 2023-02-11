const errorHandler = (elements, error) => {
  elements.input.classList.add('is-invalid');
};

const initState = (elements) => {
  elements.input.classList.remove('is-invalid');
  elements.feedback.textContent = '';
  elements.input.focus();
  elements.form.reset();
};

const render = (state, elements) => {
  if (state.addingRssProcess === 'failed') {
    errorHandler(elements, state.addingRssProcess.error);
  }
};

export default render;
