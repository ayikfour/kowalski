const IO = require('../utils/IO');

class Weighting {
   constructor(documents = [], query = []) {
      this.documents = documents;
      this.query = query;
   }

   /**
    * Set the documents to the class
    * @param {*} documents
    * an array of token
    */
   setText(documents = []) {
      this.documents = documents;
   }

   setQuery(query = []) {
      this.query = query;
   }

   getTerm(documents = []) {
      let terms = documents.reduce((prev, current) => prev.concat(current));
      terms = Array.from(new Set(terms));
      return terms;
   }

   getQuery(queries = []) {
      return Array.from(new Set(queries));
   }

   getRawTermWeight(terms = [], documents = []) {
      let termFrequencies = documents.map((document) => {
         return terms.map((term) => {
            return document.filter((token) => token == term).length;
         });
      });

      return termFrequencies;
   }

   getLogTermWeight(terms = [], documents = []) {
      let logTermWeight = documents.map((document) => {
         return terms.map((term) => {
            let count = document.filter((token) => token == term).length;
            if (count == 0) {
               return 0;
            } else {
               return 1 + Math.log10(count);
            }
         });
      });

      return logTermWeight;
   }

   getLogQueryWeight(terms = [], query = []) {
      let logQueryWeight = terms.map((term) => {
         let count = query.filter((token) => token == term).length;
         if (count == 0) {
            return 0;
         } else {
            return 1 + Math.log10(count);
         }
      });
      return logQueryWeight;
   }

   getDocumentFrequency(terms = [], documents = []) {
      let documentFrequencies = terms.map((term) => {
         return documents.filter((document) => {
            return document.includes(term);
         }).length;
      });

      return documentFrequencies;
   }

   getIDF(documentFrequencies = [], documents = []) {
      let IDF = documentFrequencies.map((DF) => {
         return Math.log10(documents.length / DF);
      });
      return IDF;
   }

   getTFIDF(logTerms = [], IDF = []) {
      let TFIDF = logTerms.map((term, index) => {
         return term.map((frequency) => {
            return frequency * IDF[index];
         });
      });

      return TFIDF;
   }

   write() {
      console.log('WRITING DOCUMENT');
      let documents = this.documents;
      IO.writeTo('Documents', this.documents);

      console.log('WRITING TERMS');
      let terms = this.getTerm(documents);
      IO.writeTo('Terms', terms);

      console.log('WRITING TERM FREQUENCIES');
      let rawTermWeight = this.getRawTermWeight(terms, documents);
      IO.writeTo('TermFrequencies', rawTermWeight);

      console.log('WRITING LOG TERM FREQUENCIES');
      let logTermWeight = this.getLogTermWeight(terms, documents);
      IO.writeTo('LogTermWeight', logTermWeight);

      console.log('WRITING DOCUMENT FREQUENCIES');
      let documentFrequencies = this.getDocumentFrequency(terms, documents);
      IO.writeTo('DocumentFrequencies', documentFrequencies);

      console.log('WRITING INVERSE DOC FREQUENCIES');
      let IDF = this.getIDF(documentFrequencies, documents);
      IO.writeTo('IDF', IDF);

      console.log('WRITING TFIDF');
      let TFIDF = this.getTFIDF(logTermWeight, IDF);
      IO.writeTo('TFIDF', TFIDF);

      console.log('FINISHED WRITING');
   }
}

module.exports = Weighting;
