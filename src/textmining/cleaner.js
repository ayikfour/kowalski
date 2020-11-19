const { Stemmer } = require('sastrawijs');
const fs = require('fs');
const path = require('path');

function caseFold(document = '') {
   return document.toLowerCase();
}

/**
 *Removing any special character and trailing whitespace
 * @param {*} document
 * a string to be processed.
 */
function clean(document = '') {
   return document
      .replace(/http\S+/g, '') //remove url
      .replace(/[\n\r]/g, '') //remove breakspace
      .replace(/\d+/g, '') //remove number
      .replace(
         /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g,
         ''
      ) // remove emoji
      .replace(/(^|[^@\w])@(\w{1,15})\b/g, '') // usernames
      .replace(/[^\w\s]/g, ' ') //remove period
      .replace(/[,'":*?%<>{|}&\/\\$()\n\r]/g, '') //remove symbols
      .replace(/\B\s\B/g, ''); //remove whitespace
}

/**
 * Spliting document content/text per words (called token)
 * store it into array.
 * then clean the empty string and number only token.
 * @param {*} document
 * a string to be processed.
 */
function tokenize(document = '') {
   let result = document.split(' ');
   // console.log(result);
   result = result.filter((token) => token !== '');
   // console.log(result);
   result = result.filter((token) => token !== '-');
   // console.log(result);
   result = result.filter((token) => !token.match(/^[0-9]*$/g));
   // console.log(result);
   return result;
}

/**
 * Filter the token from stopword list (using stopword tala list)
 * if any token mathced with stopword list it will be removed
 * @param {*} document
 * an array of token
 */
function filter(document = [], keyword = '') {
   let keywords = keyword.split(' ');
   let filePath = path.resolve(__dirname, '../stopwords.txt');
   let stopwords = fs.readFileSync(filePath, 'utf8').split('\n');
   let filtered = document.filter(
      (word) => !stopwords.includes(word) && !keywords.includes(word)
   );
   return filtered;
}

/**
 * Turn token into base word.
 * ex: "memakan" -> "makan"
 * using sastrawi package.
 * @param {*} document
 * an array of token.
 */
function stem(document = []) {
   let stemmer = new Stemmer();
   let stemmed = document.map((word) => stemmer.stem(word));
   return stemmed;
}

/**
 * Do the preprocessing.
 * called every method in the class.
 * @param {*} document
 * a string to be processed.
 */
function now(tweets = [], keyword = '') {
   return tweets.map((tweet) => {
      let caseFolded = caseFold(tweet);
      let cleaned = clean(caseFolded);
      let tokened = tokenize(cleaned);
      let filtered = filter(tokened, keyword);
      let stemmed = stem(filtered);
      return stemmed;
   });
}

function text(tweet = '', keyword = '') {
   let caseFolded = caseFold(tweet);
   let cleaned = clean(caseFolded);
   let tokened = tokenize(cleaned);
   let filtered = filter(tokened, keyword);
   let stemmed = stem(filtered);
   return stemmed;
}

module.exports = { now, text, stem, filter, clean, tokenize, caseFold };
