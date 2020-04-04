const router = require('express').Router();
const twitterPosts = require('./tweet');

router.use('/tweets', twitterPosts);

module.exports = router;
