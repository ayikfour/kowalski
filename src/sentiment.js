const IO = require('./utils/IO');
const cleaner = require('./textmining/cleaner');
const Classification = require('./textmining/classification');
const path = require('path');
const stream = require('./utils/stream');
const ora = require('ora');

async function get(url = '', classify = '') {
   const classification = new Classification();

   const filePath = path.join(__dirname, './classification/');
   let train_documents = await IO.readBulk(filePath);

   // console.log(train_documents);
   let text = [];
   let classes = [];
   let names = [];

   train_documents.map((document) => {
      text.push(document.tweet);
      classes.push(document.class);
      names.push(document.id);
   });

   // console.log(text, classes, names);

   // training data using training method from classification class
   // must have 3 parameters: text, classes, and names
   classification.train(text, classes, names);

   let test_documents = await stream.tweet(url, classify);
   //  // get random document from test documents

   console.log(test_documents);
   //  // declare array to store test text and actual class
   let test_text = [];
   let actual_class = [];

   //  // destructure test document to text, and actual class
   test_documents.map((document) => {
      test_text.push(document.tweet);
      actual_class.push(document.class);
   });

   console.log(test_documents);
   //  // testing the test document, returning class prediction
   let prediction = classification.test(test_text, 4);

   //  // get the acuracy of the prediction
   let accuracy = classification.accuracy(prediction, actual_class);
}

async function train(url = '', classify = '') {
   const header = [
      { id: 'username', title: 'username' },
      { id: 'tweet', title: 'tweet' },
      { id: 'id', title: 'id' },
      { id: 'date', title: 'date' },
      { id: 'class', title: 'class' },
   ];

   const spinner = ora(`Kowalski saving tweet in ${classify}`);

   try {
      const tweet = await stream.tweet(url, classify);
      const _path = path.join(__dirname, `./classification/${classify}.csv`);
      await IO.writeCSV(_path, header, tweet);
      spinner.succeed(`Data has been saved!`);
   } catch (error) {
      spinner.fail("Data can't be saved. Please try again.");
      console.log(error);
   }
}

const archive = async (id) => {
   try {
      const filePath = path.join(__dirname, './classification/');
      let train_documents = await IO.readBulk(filePath);
      console.log(train_documents[id]);
   } catch (error) {
      console.log(error);
   }
};

module.exports = {
   get,
   train,
   archive,
};
