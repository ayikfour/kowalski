// const client = require('./client')();
const ora = require('ora');
const auth = require('./auth');
const client = require('./client');

var Step = require('step');
var colors = require('colors');

/**
 *
 * @param {*} username
 * @param {*} count
 */
const tweetsFrom = async (username = '', count) => {
   const spinner = ora({
      text: `kowalski inspecting ${username} <(￣︶￣)>`,
   }).start();

   try {
      const twit = client();
      const { data, resp } = await twit.get('statuses/user_timeline', {
         screen_name: username,
         count: count,
      });
      spinner.succeed('kowalski got data from user (´ ∀ ` *)');
      const tweets = data.map((tweet) => {
         let text = tweet.text;
         return text;
      });

      return tweets;
   } catch (error) {
      ErrorHandler(error, spinner);
   }
};

const tweet = async (url = '', classify) => {
   const id = url.split('/').pop();
   const spinner = ora({
      text: `kowalski getting tweet from ${id} <(￣︶￣)>`,
   }).start();
   try {
      const twit = client();
      const { data } = await twit.get('statuses/show', {
         id: id,
         tweet_mode: 'extended',
      });

      const document = [
         {
            username: data.user.screen_name,
            tweet: data.full_text.replace(/[\n\r]/g, ''),
            id: data.id,
            date: Date.now(),
            class: classify,
         },
      ];
      spinner.succeed(
         `kowalski got tweet from ${document.username}` + '(´ ∀ ` *)'
      );
      return document;
   } catch (error) {
      ErrorHandler(error, spinner);
   }
};

/**
 *
 * @param {*} count
 */
const timeline = async (count) => {
   const spinner = ora({
      text: 'kowalski inspecting timeline<(￣︶￣)>',
   }).start();

   try {
      const twit = client();
      const { data, resp } = await twit.get('statuses/home_timeline', {
         count: count,
      });
      spinner.succeed('kowalski got data from timeline (´ ∀ ` *)');
      const tweets = data.map((tweet) => {
         let text = tweet.text;
         return text;
      });
      return tweets;
   } catch (error) {
      ErrorHandler(error, spinner);
   }
};

const search = async (keywords = '', count = 100) => {
   const spinner = ora({
      text: `kowalski inspecting search for '${keywords}' <(￣︶￣)>`,
   }).start();

   try {
      const twit = client();
      const { data, resp } = await twit.get('search/tweets', {
         q: keywords,
         count: count,
      });

      spinner.succeed('kowalski got tweets from search (´ ∀ ` *)');
      const tweets = data.statuses.map((tweet) => {
         let text = tweet.text;
         return text;
      });

      return tweets;
   } catch (error) {
      ErrorHandler(error, spinner);
   }
};

const app = async () => {
   try {
      const { data } = await client.get('application/rate_limit_status');
      return data;
   } catch (error) {
      ErrorHandler(error, spinner);
   }
};

/**
 *
 * @param {*} error
 * @param {*} spinner
 */
const ErrorHandler = (error, spinner) => {
   spinner.fail('kowalski found some problem ヽ(`⌒´メ)ノ	');
   console.log('✘', error.message);
   console.log(
      '✘ try to reconfigure your authentication using ' + 'kowalski oauth'.bold
   );
   process.exit(9);
};

module.exports = {
   tweetsFrom,
   timeline,
   search,
   tweet,
   app,
};
