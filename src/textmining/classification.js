const Preprocessing = require('./preprocessing');
const Weighting = require('./weighter');
const InformationRetrieval = require('./informationRetrieval');
const log = console.log;
const IO = require('../utils/IO');

class Classification {
   constructor() {
      this.documents = {
         classes: [],
         texts: [],
         names: [],
         terms: [],
         weights: [],
         TFIDF: [],
         frequencies: [],
      };
      this.tests = {
         classes: [],
         texts: [],
         names: [],
         TFIDF: [],
         weights: [],
         prediction: [],
      };
      this.option = {
         documents: 'documents',
         tests: 'tests',
      };
      this.preprocessing = new Preprocessing();
      this.weighting = new Weighting();
      this.IR = new InformationRetrieval();
   }

   train(documents = [], classes = [], names = []) {
      log('Training documents: ');
      log(`total ${documents.length} total document`);

      // destructure new documents to documents.text array
      this.documents.texts = [...this.documents.texts, ...documents];

      // destructure new documents's classes to documents.classes array
      this.documents.classes = [...this.documents.classes, ...classes];

      // preprocessing train documents
      // cleaning and tokenize
      this.preprocess(this.option.documents);

      // weighting train documents
      this.weight(this.option.documents);
   }

   weight(option = '') {
      switch (option) {
         //Weighting training documents
         case 'documents':
            // get terms log frequencies/weight
            this.documents.weights = this.weighting.getLogTermWeight(
               this.documents.terms,
               this.documents.texts
            );

            // write terms log frequencies/weight
            IO.writeTo('train_term_logweight', this.documents.weights);

            // get documents log frequencies/weight
            this.documents.frequencies = this.weighting.getDocumentFrequency(
               this.documents.terms,
               this.documents.texts
            );

            // write documents log frequencies/weight
            IO.writeTo('train_document_frequency', this.documents.frequencies);

            // get inverse  documents log frequencies/weight
            this.documents.frequencies = this.weighting.getIDF(
               this.documents.frequencies,
               this.documents.texts
            );

            // write inverse documents log frequencies/weight
            IO.writeTo(
               'train_document_inverse_frequency',
               this.documents.frequencies
            );

            // get tfidf
            this.documents.TFIDF = this.weighting.getTFIDF(
               this.documents.weights,
               this.documents.frequencies
            );

            // write tfidf to file
            IO.writeTo('train_tfidf', this.documents.TFIDF);

            // get tfidf normalized
            this.documents.TFIDF = this.IR.normalized(this.documents.TFIDF);

            // write tfidf normalized to file
            IO.writeTo('train_tfidf_normalized', this.documents.TFIDF);
            break;

         // wighting test documents
         case 'tests':
            // get terms log frequencies/weight
            this.tests.weights = this.weighting.getLogTermWeight(
               this.documents.terms,
               this.tests.texts
            );

            // write terms log frequencies/weight
            IO.writeTo('test_term_logweight', this.tests.weights);

            // get tfidf tests documents
            this.tests.TFIDF = this.weighting.getTFIDF(
               this.tests.weights,
               this.documents.frequencies
            );

            // write tfidf tests documents to file
            IO.writeTo('test_tfidf', this.tests.TFIDF);

            // get tfidf normaized tests documents
            this.tests.TFIDF = this.IR.normalized(this.tests.TFIDF);

            // write tfidf normalized tests documents to file
            IO.writeTo('test_tfidf_normalized', this.tests.TFIDF);
            break;
      }
   }

   preprocess(option = '') {
      switch (option) {
         case 'documents':
            // preprocessing documents
            this.documents.texts = this.documents.texts.map((text) =>
               this.preprocessing.start(text)
            );

            // get documents terms
            this.documents.terms = this.weighting.getTerm(this.documents.texts);

            // writing terms into files
            IO.writeTo('train_terms', this.documents.terms);
            break;
         case 'tests':
            // preprocessing documents
            this.tests.texts = this.tests.texts.map((text) =>
               this.preprocessing.start(text)
            );

            // get documents terms
            this.tests.texts = this.tests.texts.map((text) => {
               return this.weighting.getQuery(text);
            });

            // writing terms into files
            IO.writeTo('test_terms', this.tests.texts);
            break;
      }
   }

   test(documents = [], k = 1) {
      log('Testing documents: ');
      log(`testing ${documents.length} documents`);

      // set test documents to tests.text array
      this.tests.texts = documents;

      log(documents);

      // preprocess test doccuments
      // cleaning the text and tokenize
      this.preprocess(this.option.tests);

      // weighting test documents
      this.weight(this.option.tests);

      // iterate through every documents in tests as query
      this.tests.TFIDF.map((query, index) => {
         // predict the query's (document's) class using KNN algorithm
         log('predicting document: ' + index);
         let prediction = this.knn(k, query);

         // predict the query's (document's) class using KNN algorithm
         this.tests.prediction.push(prediction);
      });

      return this.tests.prediction;
   }

   knn(k = 1, query = []) {
      // get cossines similarity between query and all documents
      let cossim = this.IR.cossim(this.documents.TFIDF, query);

      // get neighbour as much as K value from based on cossim
      let neighbours = this.IR.distance(cossim).slice(0, k);

      console.group();

      // logging to console
      neighbours.forEach((neighbour, index) => {
         log(
            'document: ',
            neighbour.document,
            'distance: ',
            neighbour.distance
         );
      });

      // get neighbour classes
      let classes = neighbours.map((neighbour) => {
         return this.documents.classes[neighbour.document];
      });

      // get the prediction class
      let prediction = this.decission(classes);
      log('prediction: ', prediction);

      console.groupEnd();

      return prediction;
   }

   decission(classes = []) {
      // create unique set of array from classes. discard same class entry
      let unique_classes = Array.from(new Set(classes));

      // get count of every class in unique_classes array
      unique_classes = unique_classes.map((clas) => {
         let count = classes.filter((neighbour) => neighbour == clas).length;
         return { class: clas, count };
      });

      // sort classes by the highest value
      unique_classes.sort((a, b) => {
         return b.count - a.count;
      });

      // get first element from the array
      return unique_classes.shift().class;
   }

   accuracy(predictions = [], actuals = []) {
      log('');
      log('Predictions class:\n' + predictions.join(', '));
      log('Actual class:\n' + actuals.join(', '));

      // variable to truth value
      // increment every prediction and actual class are match
      let truth = 0;

      // check wether if prediction ana actual class is match or not
      // if match, increment prediction
      predictions.map((clas, index) => {
         if (clas == actuals[index]) {
            truth++;
         }
      });

      let accuracy = (truth / predictions.length) * 100;
      log('Accuracy: ' + accuracy);

      return accuracy;
   }
}

module.exports = Classification;
