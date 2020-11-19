const fs = require('fs');
const csv = require('csvtojson');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const util = require('util');
const path = require('path');

function writeTo(filename, documents) {
   const filePath = path.join(__dirname, `../output/${filename}.txt`);
   fs.writeFileSync(filePath, stringify(documents), { flags: 'W+' }, (err) => {
      if (err) {
         return console.log(err);
      }
      console.log('The file was saved!');
   });
}

async function writeCSV(path, header, data) {
   const csvWriter = createCsvWriter({
      path: path,
      append: true,
      header: header,
   });
   await csvWriter.writeRecords(data);
}

function readFrom(filepath = '') {
   let extension = filepath.match(/\.(txt|csv)$/gi);
   switch (extension[0]) {
      case '.csv':
         return readCSV(filepath);
      case '.txt':
         return readTXT(filepath);
      default:
         return;
   }
}

async function readBulk(dir = '') {
   try {
      const readDir = util.promisify(fs.readdir);
      // let files = fs.readdirSync(dir, { encoding: 'utf-8' });
      let files = await readDir(dir, { encoding: 'utf-8' });
      let fileslist = [];
      for (let file of files) {
         const result = await readCSV(dir + file);
         fileslist.push(result);
      }
      return fileslist.flat();
   } catch (error) {
      console.log(error);
   }
}

async function readCSV(filepath) {
   try {
      const array = await csv().fromFile(filepath);
      // console.log(array);
      return array;
   } catch (error) {
      console.log(err);
      return null;
   }
}

function readTXT(filepath = '') {
   try {
      let file = fs.readFileSync(filepath, 'utf8');
      let splitFilePath = filepath.split('/');
      let name = splitFilePath.pop();
      let classification = splitFilePath.pop();
      let document = new Document(name, classification, file);
      return document;
   } catch (error) {
      console.log(err.message);
      return null;
   }
}

function stringify(documents = []) {
   return documents.join('\r\n');
}

module.exports = { readFrom, writeTo, writeCSV, stringify, readBulk };
