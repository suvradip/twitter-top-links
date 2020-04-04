const router = require('express').Router();
const consola = require('consola');
const debug = require('debug')('api:v1:tweet.js');
const TwitterCtrl = require('../../controller/twitter');
const { Tweet } = require('../../models');

router.get('/', async (req, res) => {
   debug('get / request received');

   const { hashTags = '', locations = '', limit, offset } = req.query;
   const parsedTags = hashTags === '' ? [] : hashTags.split(',');
   const parsedLimit = typeof limit !== 'undefined' && !Number.isNaN(Number(limit)) ? Number(limit) : 10;
   const parsedSkip = typeof offset !== 'undefined' && !Number.isNaN(Number(offset)) ? Number(offset) : 0;
   const Query = {};

   if (Array.isArray(parsedTags) && parsedTags.length > 0) {
      const regXTags = parsedTags.map((opt) => new RegExp(opt, 'i'));
      Query.hashtags = { $all: regXTags };
      debug('hashtags prepared');
   }

   if (typeof locations === 'string' && locations !== '') {
      Query.location = new RegExp(locations, 'i');
      debug('location provided');
   }

   Promise.all([Tweet.find(Query).skip(parsedSkip).limit(parsedLimit).lean()])
      .then(([tweets]) => {
         debug('Tweets retrieved from DB');
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

const twitter = new TwitterCtrl();
router.get('/process', async (req, res) => {
   debug('get /process request received');
   try {
      await twitter.fetch();
      res.json({
         message: 'OK',
      });
   } catch (error) {
      consola.error(error.message);
      res.status(400).json({ message: 'Server Error', systemMessage: error.message });
   }
});

module.exports = router;
