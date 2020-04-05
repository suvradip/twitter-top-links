const path = require('path');
const fs = require('fs');
const router = require('express').Router();
const passport = require('passport');
const TwitterCtrl = require('../../controller/twitter');
const UserInfo = require('../../controller/userInfo');

function isLoggedIn(req, res, next) {
   // if user is authenticated in the session, carry on
   if (req.isAuthenticated()) return next();

   return res.redirect('/api/v1/auth');
}

const file = path.resolve(__dirname, '..', '..', 'views', 'index.html');
const loginPage = fs.readFileSync(file, 'utf8');

router.get('/', (req, res) => {
   res.send(loginPage);
});

router.get('/twitter', passport.authenticate('twitter'));

// handle the callback after twitter has authenticated the user
router.get(
   '/twitter/callback',
   passport.authenticate('twitter', {
      successRedirect: '/api/v1/auth/profile',
      failureRedirect: '/api/v1/auth/',
   })
);

router.get('/profile', isLoggedIn, async (req, res) => {
   const { user } = req;

   /* create a user in DB */
   const userInstance = new UserInfo(user.username);
   const newUser = await userInstance.save({ name: user.name, photo: user.photo });

   const twitter = new TwitterCtrl({
      username: user.username,
      userToken: user.token,
      userSecretToken: user.tokenSecret,
      lastId: newUser.lastTweetId,
   });
   //  await twitter.fetch();

   res.json({
      user: req.user,
      newUser,
   });
});

module.exports = router;
