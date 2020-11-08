require('dotenv').config();
const fs = require('fs');
const path = require('path');
const envfile = require('envfile');
var inquirer = require('inquirer');
const client = require('./client');
var sourcePath = '.env';

const readline = require('readline').createInterface({
   input: process.stdin,
   output: process.stdout,
});

const token = {
   TWITTER_CONSUMER_KEY: process.env.TWITTER_CONSUMER_KEY,
   TWITTER_CONSUMER_SECRET: process.env.TWITTER_CONSUMER_SECRET,
   TWITTER_ACCESS_TOKEN: process.env.TWITTER_ACCESS_TOKEN,
   TWITTER_ACCESS_TOKEN_SECRET: process.env.TWITTER_ACCESS_TOKEN_SECRET,
};

const isAuthenticated = () => {
   if (
      process.env.TWITTER_CONSUMER_KEY &&
      process.env.TWITTER_CONSUMER_SECRET &&
      process.env.TWITTER_ACCESS_TOKEN &&
      process.env.TWITTER_ACCESS_TOKEN_SECRET
   ) {
      console.log('everyhtings is fine!');
      console.log("if you want to configure token, run: 'kowalski reconfig'");
      return true;
   } else {
      console.log(
         "Kowalski can't investigate, you need to give kowalksi token"
      );
      return false;
   }
};

const get = async () => {
   try {
      var questions = [];

      for (const property in token) {
         if (token[property]) continue;
         questions.push({
            type: 'input',
            name: property,
            message: `Your ${property.toLowerCase}?`,
         });
      }

      const answers = await inquirer.prompt(questions);

      for (const property in answers) {
         token[property] = answers[property];
         process.env[property] = answers[property];
      }

      return token;
   } catch (error) {
      console.log(error.message);
   }
};

const input = async () => {
   try {
      var questions = [];

      for (const property in token) {
         questions.push({
            type: 'input',
            name: property,
            message: `Your ${property}?`,
            default: function () {
               return token[property];
            },
         });
      }

      const answers = await inquirer.prompt(questions);

      for (const property in answers) {
         token[property] = answers[property];
         process.env[property] = answers[property];
      }

      return token;
   } catch (error) {
      console.log(error.message);
   }
};

function write(token) {
   try {
      const filePath = path.join(__dirname, '../../.env');
      fs.writeFileSync(filePath, envfile.stringify(token), {
         flags: 'W+',
      });
   } catch (error) {
      console.log(error.message);
   }
}

function show() {
   console.log(token);
   return;
}

const reconfig = async () => {
   try {
      const token = await input();
      write(token);
      console.table(token);
   } catch (error) {
      console.log(error.message);
   }
};

const now = async () => {
   try {
      if (isAuthenticated()) process.exit(9);
      const token = await get();
      write(token);
      console.table(token);
   } catch (error) {
      console.log(error.message);
   }
};

module.exports = { isAuthenticated, now, get, write, show, reconfig };
