const auth = require('../utils/auth');
const client = require('../utils/client');
const cleaner = require('./cleaner');
const IO = require('../utils/IO');
const path = require('path');

async function collect(url = '', classify = '') {
   const id = url.split('/').pop();
   const T = client();

   const header = [
      { id: 'username', title: 'username' },
      { id: 'tweet', title: 'tweet' },
      { id: 'id', title: 'id' },
      { id: 'date', title: 'date' },
   ];

   try {
      const { data } = await T.get('statuses/show', {
         id: id,
         tweet_mode: 'extended',
      });

      const tweet = [
         {
            username: data.user.screen_name,
            tweet: data.full_text,
            id: data.id,
            date: Date.now(),
         },
      ];

      const _path = path.join(__dirname, `../classification/${classify}.csv`);
      await IO.writeCSV(_path, header, tweet);
      console.log('The CSV file was written successfully');
   } catch (error) {
      console.log(error);
   }
}

module.exports = { collect };
