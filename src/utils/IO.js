const fs = require('fs');
const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

function writeTo(filename, documents) {
   fs.writeFileSync(
      `./output/${filename}.txt`,
      stringify(documents),
      { flags: 'W+' },
      (err) => {
         if (err) {
            return console.log(err);
         }
         console.log('The file was saved!');
      }
   );
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

function readBulk(dir = '', fileslist) {
   try {
      files = fs.readdirSync(dir, { encoding: 'utf-8' });
      fileslist = fileslist || [];
      files.forEach((file) => {
         let isDirectory = fs.statSync(dir + file).isDirectory();
         if (isDirectory) {
            fileslist = readBulk(dir + file + '/', fileslist);
         } else {
            fileslist.push(readTXT(dir + file));
         }
      });
      return fileslist;
   } catch (error) {
      console.log(error);
   }
}

function readCSV(filepath) {
   let source = [];
   try {
      fs.createReadStream(filepath)
         .pipe(csv())
         .on('data', (row) => {
            source.push(row);
         })
         .on('end', () => {
            console.log('import success');
            console.log(source);
            return source;
         });
   } catch (error) {
      console.log(err);
      return null;
   }
}

function readTXT(filepath = '') {
   try {
      let file = fs.readFileSync(filepath, 'utf8');
      return file;
   } catch (error) {
      console.log(err.message);
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
