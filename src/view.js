const initState = (elements) => {
  elements.btn.disabled = false;
  elements.input.classList.remove('is-invalid');
  elements.input.focus();
  elements.form.reset();
};

const errorHandler = (elements, error, i18nextInstance) => {
  elements.feedback.classList.remove('text-success');
  elements.feedback.classList.add('text-danger');
  if (error !== 'Network Error') elements.input.classList.add('is-invalid');
  elements.btn.disabled = false;
  const { message } = error;
  elements.feedback.textContent = i18nextInstance.t(`errors.${message}`);
};

const renderingPosts = (state, i18nInstance, card) => {
  const listGroup = document.createElement('ul');
  listGroup.classList.add('list-group', 'border-0', 'rounded-0');
  state.data.posts.forEach((post) => {
    const listGroupItem = document.createElement('li');
    listGroupItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
    const a = document.createElement('a');
    a.href = post.link;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.setAttribute('data-id', post.id);
    a.textContent = post.title;
    const button = document.createElement('button');
    button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    button.type = 'button';
    button.setAttribute('data-id', post.id);
    button.setAttribute('data-bs-toggle', 'modal');
    button.setAttribute('data-bs-target', '#modal');
    button.textContent = i18nInstance.t('preview');
    listGroupItem.append(a, button);
    listGroup.append(listGroupItem);
  });
  card.append(listGroup);
};

const renderingFeeds = (state, card) => {
  const listGroup = document.createElement('ul');
  listGroup.classList.add('list-group', 'border-0', 'rounded-0');
  state.data.feeds.forEach((feed) => {
    const listGroupItem = document.createElement('li');
    listGroupItem.classList.add('list-group-item', 'border-0', 'border-end-0');
    const h3 = document.createElement('h3');
    h3.classList.add('h6', 'm-0');
    h3.textContent = feed.title;
    const p = document.createElement('p');
    p.classList.add('m-0', 'small', 'text-black-50');
    p.textContent = feed.description;
    listGroupItem.append(h3, p);
    listGroup.append(listGroupItem);
  });
  card.append(listGroup);
};

const makeContainer = (title, state, elements, i18nInstance) => {
  elements[title].textContent = '';

  const card = document.createElement('div');
  card.classList.add('card', 'border-0');
  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');
  const cardTitle = document.createElement('h2');
  cardTitle.classList.add('card-title', 'h4');
  cardTitle.textContent = i18nInstance.t(title);
  cardBody.append(cardTitle);
  card.append(cardBody);
  elements[title].append(card);
  if (title === 'feeds') {
    renderingFeeds(state, card);
  }
  if (title === 'posts') {
    renderingPosts(state, i18nInstance, card);
  }
};

const successHandler = (state, elements, i18nextInstance) => {
  initState(elements);
  elements.feedback.textContent = '';
  elements.feedback.classList.remove('text-danger');
  elements.feedback.classList.add('text-success');
  elements.feedback.textContent = i18nextInstance.t('rssAdded');
  makeContainer('posts', state, elements, i18nextInstance);
  makeContainer('feeds', state, elements, i18nextInstance);
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
        errorHandler(elements, state.addingRssProcess.error, i18nextInstance);
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
