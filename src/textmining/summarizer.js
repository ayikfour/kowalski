// import _ from 'lodash';
const _ = require('lodash');

function getWords(tweets = []) {
   let words = tweets.reduce((prev, current) => prev.concat(current));
   words = Array.from(new Set(words));
   return words;
}

function getDocumentFrequency(words = [], tweets = []) {
   let documentFrequencies = words.map((word) => {
      return tweets.filter((document) => {
         return document.includes(word);
      }).length;
   });

   return documentFrequencies;
}

function now(tweets = [], summarizeCount = 10) {
   try {
      const words = getWords(tweets);
      const frequency = getDocumentFrequency(words, tweets);

      // combine array words with frequency
      const combined = _.zipWith(words, frequency, function (term, freq) {
         return { most_talked: term, count: freq };
      });

      // sort the combined arrray to get the most talked topic
      let sorted = _.orderBy(combined, 'count', 'desc');

      // get the top-n count most talked
      let summary = sorted.slice(0, summarizeCount);

      // add the date time to the summary result
      return summary;
   } catch (error) {
      console.log(error);
   }
}

module.exports = {
   getWords,
   getDocumentFrequency,
   now,
};
