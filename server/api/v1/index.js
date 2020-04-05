const router = require('express').Router();
const twitterPosts = require('./tweet');
const users = require('./user');
const auth = require('./auth');

router.use('/tweets', twitterPosts);
router.use('/users', users);
router.use('/auth', auth);
module.exports = router;
