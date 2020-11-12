const token = require('../../config.json');
const fs = require('fs');
const path = require('path');
var inquirer = require('inquirer');
var sourcePath = '.env';

const isAuthenticated = () => {
   if (
      token.consumer_key &&
      token.consumer_secret &&
      token.access_token &&
      token.access_token_secret
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
   // envfile.stringify(token)
   // path.join(__dirname, '../../.env')
   try {
      const filePath = path.join(__dirname, '../../config.json');
      fs.writeFileSync(filePath, JSON.stringify(token), {
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
