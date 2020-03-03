const path = require('path');
const rand = require('crypto-random-string');
const os = require('os');
const fs = require('fs');
const escapeUnsafe = require('./helpers/escapeUnsafe');

module.exports = function ImageSitemapStream() {
  const tmpPath = path.join(os.tmpdir(), `images_sitemap_${rand(10)}`);
  const stream = fs.createWriteStream(tmpPath);

  stream.write('<?xml version="1.0" encoding="utf-8" standalone="yes" ?>');
  stream.write(
    '\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">'
  );

  const getPath = () => tmpPath;

  const write = (url, images) => {
    const escapedUrl = escapeUnsafe(url);
    stream.write('\n  <url>\n');
    stream.write(`    <loc>${escapedUrl}</loc>\n`);
    if (images && images.length) {
      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        if (!img.url) {
          continue;
        }

        const imgUrl = escapeUnsafe(img.url);
        const title = img.title ? escapeUnsafe(img.title) : '';

        stream.write(`    <image:image>\n`);
        stream.write(`        <image:loc>${imgUrl}</image:loc>\n`);
        stream.write(`        <image:title>${title}</image:title>\n`);
        stream.write(`    </image:image>\n`);
      }
    }
    stream.write('  </url>');
  };

  const end = () => {
    stream.write('\n</urlset>');
    stream.end();
  };

  return {
    getPath,
    write,
    end
  };
};
