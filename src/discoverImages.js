/* eslint-disable no-console */
const url = require('url');

module.exports = (imageSitemap, queueItem, $) => {
  const images = $('img[src]')
    .map(function iteratee() {
      let href = $(this).attr('src');

      // exclude rel="nofollow" links
      const rel = $(this).attr('rel');
      if (/nofollow/i.test(rel)) {
        return null;
      }

      // remove anchors
      href = href.replace(/(#.*)$/, '');

      //remove basic authentication
      href = href.replace(/^\/?([^/]*@)/, '');

      // handle "//"
      if (/^\/\//.test(href)) {
        return `${queueItem.protocol}:${href}`;
      }

      // check if link is relative
      // (does not start with "http(s)" or "//")
      if (!/^https?:\/\//.test(href)) {
        const base = $('base').first();
        if (base.length) {
          // base tag is set, prepend it
          if (base.attr('href') !== undefined) {
            // base tags sometimes don't define href, they sometimes they only set target="_top", target="_blank"
            href = url.resolve(base.attr('href'), href);
          }
        }

        // handle links such as "./foo", "../foo", "/foo"
        if (/^\.\.?\/.*/.test(href) || /^\/[^/].*/.test(href)) {
          href = url.resolve(queueItem.url, href);
        }
      }

      return { url: href, title: $(this).attr('alt') };
    })
    .get();

  if (images.length) {
    imageSitemap.addURL(queueItem.url, images);
  }
};
