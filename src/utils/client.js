require('dotenv').config();
const Twit = require('twit');

const token = {
   consumer_key: process.env.TWITTER_CONSUMER_KEY,
   consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
   access_token: process.env.TWITTER_ACCESS_TOKEN,
   access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
};

module.exports = function () {
   try {
      return new Twit(token);
   } catch (error) {
      throw error;
   }
};
