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

const render = (state, elements) => (path, value) => {
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
        initState(elements);
      }
      break;
    default:
      break;
  }
};

export default render;
