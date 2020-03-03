const ImageSitemapStream = require('./ImageSitemapStream');

module.exports = function ImageSitemapRotator(maxEntries) {
  const sitemaps = [];
  let count = 0;
  let current = null;

  // return temp sitemap paths
  const getPaths = () =>
    sitemaps.reduce((arr, map) => {
      arr.push(map.getPath());
      return arr;
    }, []);

  // adds url to stream
  const addURL = (url, images) => {
    // exclude existing sitemap.xml
    if (/sitemap\.xml$/.test(url)) {
      return;
    }

    // create stream if none exists
    if (current === null) {
      current = ImageSitemapStream();
      sitemaps.push(current);
    }

    // rotate stream
    if (count === maxEntries) {
      current.end();
      current = ImageSitemapStream();
      sitemaps.push(current);
      count = 0;
    }

    current.write(url, images);

    count += 1;
  };

  // close stream
  const finish = () => {
    if (current) {
      current.end();
    }
  };

  return {
    getPaths,
    addURL,
    finish
  };
};
