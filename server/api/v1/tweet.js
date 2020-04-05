const router = require('express').Router();
const consola = require('consola');
const debug = require('debug')('server:api:v1:tweet.js');
// const TwitterCtrl = require('../../controller/twitter');
const { Tweet } = require('../../models');
const isLoggedIn = require('../../middleware/authorization');

router.get('/', isLoggedIn, async (req, res) => {
   debug('Get /api/v1/tweets/ request received');

   const { userId } = req;
   const { limit, offset, query = '' } = req.query;
   const parsedLimit = typeof limit !== 'undefined' && !Number.isNaN(Number(limit)) ? Number(limit) : 10;
   const parsedSkip = typeof offset !== 'undefined' && !Number.isNaN(Number(offset)) ? Number(offset) : 0;
   const Query = {
      twitterUserId: userId,
   };

   if (query !== '') {
      debug(`Requested query: ${query}`);
      Query.$text = { $search: query };
   }

   return Promise.all([Tweet.find(Query).skip(parsedSkip).limit(parsedLimit).sort({ createdAt: -1 }).lean()])
      .then(([tweets]) => {
         debug('Tweets retrieved from DB and sent.');
         res.json({
            message: 'OK',
            count: tweets.length,
            data: tweets,
         });
      })
      .catch((error) => {
         consola.error(error.message);
         res.status(400).json({ message: 'Server Error', systemMessage: error.message });
      });
});

// const twitter = new TwitterCtrl();
// router.get('/process', async (req, res) => {
//    debug('get /api/v1/tweets/process request received');
//    try {
//       await twitter.fetch();
//       res.json({
//          message: 'OK',
//       });
//    } catch (error) {
//       consola.error(error.message);
//       res.status(400).json({ message: 'Server Error', systemMessage: error.message });
//    }
// });

module.exports = router;
