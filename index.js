const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const stream = fs.createWriteStream('data.log', {flags: 'a'});
const LINK_TO_CRAWL = 'https://www.samsung.com/us/';

axios.get(LINK_TO_CRAWL).then((resp) => {
  $ = cheerio.load(resp.data);
  links = $('a'); // jquery get all hyperlinks
  $(links).each(function(i, link) {
    crawl($(link).attr('href'));
  });
});

/**
 * Crawl url and follow links & buttons
 * @param {string} url Request URI
 */
function crawl(url) {
  const re = new RegExp('^(http|https)://', 'i');
  const match = re.test(url);

  if (match) {
    axios.get(url).then((resp) => {
      require('crypto').randomBytes(8, function(err, buffer) {
        if (resp != undefined) {
          if (resp != null) {
            if (resp.data != undefined) {
              if (resp.data != null) {
                const token = buffer.toString('hex');
                const streamx = fs.createWriteStream(
                    __dirname + '\\logs\\' + token + '.html',
                    {flags: 'a'},
                );
                streamx.write(resp.data.toString());
                streamx.close();
              }
            }
          }
        }
      });
      $ = cheerio.load(resp.data);
      links = $('a'); // jquery get all hyperlinks
      $(links).each(function(i, link) {
        if ($(link).attr('href').startsWith('http')) {
          console.log($(link).attr('href'));
          crawl($(link).attr('href'));
          stream.write($(link).attr('href') + '\n');
        }
        return true;
      });
      buttons = $('button');
      $(buttons).each(function(i, link) {
        if ($(link).attr('href').startsWith('http')) {
          console.log($(link).attr('href'));
          crawl($(link).attr('href'));
          stream.write($(link).attr('href') + '\n');
        }
        return true;
      });
    }).catch(function(error) {
      return false;
    });
  }
}
