const path = require('path');
const fs = require('fs');
const router = require('express').Router();
const consola = require('consola');
const passport = require('passport');
const debug = require('debug')('server:api:v1:auth.js');
const TwitterCtrl = require('../../controller/twitter');
const UserInfo = require('../../controller/userInfo');
const isLoggedIn = require('../../middleware/authorization');

const file = path.resolve(__dirname, '..', '..', 'views', 'index.html');
const loginPage = fs.readFileSync(file, 'utf8');
const isProd = process.env.NODE_ENV === 'production';

router.get('/', (req, res) => {
   debug('Login page requested');
   res.send(loginPage);
});

router.get('/logout', (req, res) => {
   req.logout();
   res.redirect('/api/v1/auth/');
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
   debug('GET /api/v1/auth/profile');
   debug('Success callback fired');

   const { user } = req;
   /* create a user in DB */
   const userInstance = new UserInfo(user.username);
   const newUser = await userInstance.save({ name: user.name, photo: user.photo });
   try {
      const twitter = new TwitterCtrl({
         username: user.username,
         userToken: user.token,
         userSecretToken: user.tokenSecret,
         lastId: newUser.lastTweetId,
      });

      await twitter.fetch();

      debug('Data fetching from twitter complete.');
      // res.json({
      //    user: req.user,
      //    newUser,
      // });
      if (isProd) {
         return res.redirect(`/?user=${user.username}`);
      }
      return res.redirect(`http://localhost:8081/?user=${user.username}`);
   } catch (error) {
      consola.error(error.message);
      // res.status(400).json({
      //    message: error.message,
      // });
      if (isProd) {
         return res.redirect(`/?user=${user.username}`);
      }
      return res.redirect(`http://localhost:8081/?user=${user.username}`);
   }
});

module.exports = router;
