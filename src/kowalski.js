const ora = require('ora');

// Kowalski utils function
const stream = require('./utils/stream');
const clean = require('./textmining/cleaner');
const summarize = require('./textmining/summarizer');

const username = async ({ username, count }) => {
   const spinner = ora('Kowalski ready (￢‿￢ )');
   try {
      let tweets = [];
      //  get tweets from Twtitter API's
      tweets = await stream.tweetsFrom(username, count);

      // clean the tweets by running clean modules
      tweets = clean.now(tweets);
      // get tweets summary by counting document frequencies
      let summary = summarize.now(tweets);
      summary = summary.map((item) => {
         return { ...item, username: username, date: new Date() };
      });
      // print the result to console
      spinner.succeed(`Last ${count} tweet summary from: ${username}`);
      console.table(summary);
   } catch (error) {
      ErrorHandler(error, spinner);
   }
};

const timeline = async ({ username, count }) => {
   const spinner = ora('Kowalski ready (￢‿￢ )');
   try {
      let tweets = [];
      //  get tweets from Twtitter API's
      tweets = await stream.timeline(count);
      // clean the tweets by running clean modules
      tweets = clean.now(tweets);
      // get tweets summary by counting document frequencies
      let summary = summarize.now(tweets);
      summary = summary.map((item) => {
         return { ...item, date: new Date() };
      });
      // print the result to console
      console.log(`Last ${count} tweet summary from: timeline`);
      console.table(summary);
   } catch (error) {
      ErrorHandler(error, spinner);
   }
};

const search = async ({ search, count }) => {
   const spinner = ora('Kowalski ready (￢‿￢ )');
   try {
      let keyword = search;
      let tweets = [];
      //  get tweets from Twtitter API's
      tweets = await stream.search(keyword, count);
      // clean the tweets by running clean modules
      tweets = clean.now(tweets, keyword);
      // get tweets summary by counting document frequencies
      let summary = summarize.now(tweets);
      summary = summary.map((item) => {
         return { ...item, keyword: keyword, date: new Date() };
      });
      // print the result to console
      console.log(`Most paired words with ${keyword} on twitter search`);
      console.table(summary);
   } catch (error) {
      ErrorHandler(error, spinner);
   }
};

const version = (args) => {
   const { version } = require('../package.json');
   console.log(`v${version}`);
};

const help = () => {
   const menu = `
kowalski [command] <options>
   [command]:
   --search, -s .............. show most talked word with search query
   --timeline, -t ............ show most talked word on the timeline
   --username, -u ............ show most talked word from a user
   --version, -v ............. show package version
   --help, -h ................ show help menu for a command

   <options>:
   --count, -c ............... set how much tweets to be fetched
`;

   console.log(menu);
   process.exit();
};

const ErrorHandler = (error, spinner) => {
   spinner.fail('kowalski found some problem ヽ(`⌒´メ)ノ	');
   console.log('✘', error.message);
   console.log(
      '✘ try to reconfigure your authentication using ' + 'kowalski oauth'.bold
   );
   process.exit(9);
};

module.exports = { username, search, timeline, version, help };
