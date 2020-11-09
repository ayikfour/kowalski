const minimist = require('minimist');
const kowalski = require('./kowalski');
const error = require('./utils/error');
const auth = require('./utils/auth');

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

module.exports = () => {
   let cmd = args._[0] || 'help';

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

      case 'auth':
         auth.now();
         break;

      case 'reconfig':
         auth.reconfig();
         break;

      default:
         error(`"${cmd}" is not a valid command!`, true);
         break;
   }
};
