const router = require('express').Router();
const twitterPosts = require('./tweet');
const users = require('./user');

router.use('/tweets', twitterPosts);
router.use('/users', users);

module.exports = router;
