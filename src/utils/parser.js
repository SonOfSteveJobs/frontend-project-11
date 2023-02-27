const parse = (contents) => {
  const xmlDocument = new DOMParser().parseFromString(contents, 'text/xml');
  console.log(xmlDocument);
  const tagName = xmlDocument.documentElement.tagName.toLowerCase();
  if (tagName !== 'rss') {
    throw new Error('noRSS');
  }

  const channel = xmlDocument.querySelector('channel');
  const channelTitle = xmlDocument.querySelector('channel title').textContent;
  const channelDescription = xmlDocument.querySelector('channel description').textContent;
  const feed = { title: channelTitle, description: channelDescription };

  const itemElements = channel.getElementsByTagName('item');
  const posts = [...itemElements].map((item) => {
    const title = item.querySelector('title').textContent;
    const description = item.querySelector('description').textContent;
    const link = item.querySelector('channel link').textContent;
    return {
      title,
      description,
      link,
    };
  });

  return { feed, posts };
};

export default parse;
