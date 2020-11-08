const Twit = require('twit');
const token = require('../../config.json');

module.exports = function () {
   try {
      return new Twit(token);
   } catch (error) {
      throw error;
   }
};
