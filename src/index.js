const minimist = require('minimist');
const kowalski = require('./kowalski');
const error = require('./utils/error');
const auth = require('./utils/auth');
const oa = require('./utils/oauth');
const sentiment = require('./sentiment');

var args = minimist(process.argv.slice(2), {
   alias: {
      u: 'username',
      c: 'count',
      s: 'search',
      v: 'version',
      t: 'timeline',
   },
   default: {
      count: 100,
   },
});

// let cmd =
// args._[0] || 'angry' || 'sad' || 'confused' || 'happy' || 'neutral';

const classify = ['negative', 'sad', 'confused', 'positive', 'neutral'];

module.exports = () => {
   let cmd = args._[0] || 'help';

   if (classify.includes(args._[0])) {
      cmd = 'train';
   }

   if (args.version || args.v) {
      cmd = 'version';
   }

   if (args.help || args.h) {
      cmd = 'help';
   }

   if (args.search || args.h) {
      cmd = 'search';
   }

   if (args.username || args.u) {
      cmd = 'user';
   }

   if (args.timeline || args.t) {
      cmd = 'timeline';
   }

   switch (cmd) {
      case 'user':
         kowalski.username(args);
         break;

      case 'timeline':
         kowalski.timeline(args);
         break;

      case 'search':
         kowalski.search(args);
         break;

      case 'help':
         kowalski.help(args);
         break;

      case 'version':
         kowalski.version(args);
         break;

      case 'train':
         const url = args._[1];
         const classify = args._[0];
         sentiment.train(url, classify);
         break;

      case 'oauth':
         oa.getRequestToken();
         break;

      default:
         error(`"${cmd}" is not a valid command!`, true);
         break;
   }
};
// case 'auth':
//    auth.now();
//    break;

// case 'reconfig':
//    auth.reconfig();
//    break;
