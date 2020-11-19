const { Stemmer } = require('sastrawijs');
const fs = require('fs');
const path = require('path');

class Preprocessing {
   constructor() {
      this.TAG = 'PREPROCESSING';
   }

   /**
    * Turn document content/text to lowercase
    * @param {*} document
    * a string to be processed.
    */
   caseFold(document = '') {
      return document.toLowerCase();
   }

   /**
    *Removing any special character and trailing whitespace
    * @param {*} document
    * a string to be processed.
    */
   clean(document = '') {
      return document
         .replace(/\d+/g, '')
         .replace(/[,'":*?%<>{|}&\/\\$()\n\r]/g, '')
         .replace(/[.]/g, ' ')
         .replace(/\B\s\B/g, '');
   }

   /**
    * Spliting document content/text per words (called token)
    * store it into array.
    * then clean the empty string and number only token.
    * @param {*} document
    * a string to be processed.
    */
   tokenize(document = '') {
      let result = document
         .split(' ')
         .filter((token) => token != '')
         .filter((token) => token != '-')
         .filter((token) => !token.match(/^[0-9]*$/g));
      return result;
   }

   /**
    * Filter the token from stopword list (using stopword tala list)
    * if any token mathced with stopword list it will be removed
    * @param {*} document
    * an array of token
    */
   filter(document = []) {
      let filePath = path.resolve(__dirname, '../stopwords.txt');
      let stopwords = fs.readFileSync(filePath, 'utf8').split('\r\n');
      let filtered = document.filter((word) => !stopwords.includes(word));
      return filtered;
   }

   /**
    * Turn token into base word.
    * ex: "memakan" -> "makan"
    * using sastrawi package.
    * @param {*} document
    * an array of token.
    */
   stem(document = []) {
      let stemmer = new Stemmer();
      let stemmed = document.map((word) => stemmer.stem(word));
      return stemmed;
   }

   /**
    * Console log the documents with format.
    * @param {*} document
    * an array or a string.
    */
   print(document) {
      console.log('Preprocessing: ', document);
   }

   /**
    * Do the preprocessing.
    * called every method in the class.
    * @param {*} document
    * a string to be processed.
    */
   start(document = '') {
      let caseFolded = this.caseFold(document);
      let cleaned = this.clean(caseFolded);
      let tokened = this.tokenize(cleaned);
      let filtered = this.filter(tokened);
      let stemmed = this.stem(filtered);
      return stemmed;
   }
}

module.exports = Preprocessing;
