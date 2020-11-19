const IO = require('../utils/IO');
class Retrieval {
   constructor() {}

   normalized(documents = []) {
      let square = documents.map((document) => {
         return document.map((TFIDF) => {
            return TFIDF ** 2;
         });
      });

      let length = square.map((document) => {
         return (
            document.reduce((prev, current) => {
               return prev + current;
            }) ** 0.5
         );
      });

      let normalize = documents.map((document, index) => {
         return document.map((TFIDF) => {
            return TFIDF / length[index];
         });
      });

      return normalize;
   }

   cossim(TFIDF = [], queries = []) {
      let documentSimilarity = TFIDF.map((document) => {
         let dotProduct = document.map((token, index) => {
            return token * queries[index];
         });

         let sum = dotProduct.reduce((prev, current) => {
            return prev + current;
         });

         return sum;
      });

      return documentSimilarity;
   }

   rankedRetrieval(cossim = []) {
      cossim = cossim.map((similarity, index) => {
         return { document: index, similarity };
      });

      return cossim
         .sort((a, b) => {
            return a.similarity - b.similarity;
         })
         .reverse()
         .filter((document) => document.similarity > 0);
   }

   distance(cossim = []) {
      let distances = cossim.map((similarity) => 1 - similarity);

      distances = distances.map((distance, index) => {
         return { document: index, distance };
      });

      return distances
         .sort((a, b) => {
            return b.distance - a.distance;
         })
         .reverse();
   }
}

module.exports = Retrieval;
