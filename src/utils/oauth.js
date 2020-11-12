var OAuth = require('oauth').OAuth;
const axios = require('axios').default;
const token = require('../../config.json');
const ore = require('ora');

const fs = require('fs');
const path = require('path');

var Step = require('step');
var colors = require('colors');
const ora = require('ora');

var REQUEST_TOKEN_URL = 'https://api.twitter.com/oauth/request_token';
var ACCESS_TOKEN_URL = 'https://api.twitter.com/oauth/access_token';

var key = token.consumer_key;
var secret = token.consumer_secret;

var OAUTH_VERSION = '1.0';
var HASH_VERSION = 'HMAC-SHA1';

var oa = new OAuth(
   REQUEST_TOKEN_URL,
   ACCESS_TOKEN_URL,
   key,
   secret,
   OAUTH_VERSION,
   'oob',
   HASH_VERSION
);

function getAccessToken(oa, oauth_token, oauth_token_secret, pin) {
   oa.getOAuthAccessToken(oauth_token, oauth_token_secret, pin, function (
      error,
      oauth_access_token,
      oauth_access_token_secret,
      results2
   ) {
      if (error) {
         if (parseInt(error.statusCode) == 401) {
            throw new Error(
               'The pin number you have entered is incorrect'.bold.red
            );
         }
      }
      console.log(
         'Your OAuth Access Token: '.green + oauth_access_token.bold.cyan
      );
      console.log(
         'Your OAuth Token Secret: '.green + oauth_access_token_secret.bold.cyan
      );
      console.log(
         'Yeay, you have got your secreet token. You can save it on notes or skipped it.'
            .bold.yellow
      );
      token.access_token = oauth_access_token;
      token.access_token_secret = oauth_access_token_secret;
      writeToken();
      process.exit(1);
   });
}

function getRequestToken() {
   oa.getOAuthRequestToken(function (
      error,
      oauth_token,
      oauth_token_secret,
      results
   ) {
      if (error) {
         throw new Error([error.statusCode, error.data].join(': ').bold.red);
      } else {
         console.log(
            'In your browser, log in to your twitter account.  Then visit:'.bold
               .green
         );
         console.log(
            ('https://twitter.com/oauth/authorize?oauth_token=' + oauth_token)
               .underline.green
         );
         console.log(
            'After logged in, you will be promoted with a pin number'.bold.green
         );
         console.log('Enter the pin number here:'.bold.yellow);
         var stdin = process.openStdin();
         stdin.on('data', function (chunk) {
            pin = chunk.toString().trim();
            getAccessToken(oa, oauth_token, oauth_token_secret, pin);
         });
      }
   });
}

function writeToken() {
   // envfile.stringify(token)
   // path.join(__dirname, '../../.env')
   const spinner = ora('Writting your secret token to config').start();
   console.log(token.access_token, token.access_token_secret);
   try {
      const filePath = path.join(__dirname, '../../config.json');
      fs.writeFileSync(filePath, JSON.stringify(token), {
         flags: 'W+',
      });
      spinner.succeed('Kowalski already saved your secret token');
   } catch (error) {
      console.log(error.message);
      spinner.fail(error.message);
   }
}

module.exports = { getRequestToken };
