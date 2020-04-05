const TwitterStrategy = require('passport-twitter').Strategy;

const twitterAuth = {
   consumerKey: process.env.CONSUMER_API_KEY,
   consumerSecret: process.env.CONSUMER_API_SECRET_KEY,
   callbackURL: process.env.TWITTER_CALLBACK_URL || 'http://localhost:8080/api/v1/auth/twitter/callback',
};

function extractData(obj) {
   const photo = (obj.photos.length >= 1 && obj.photos[0].value) || '';
   return { username: obj.username, name: obj.displayName, photo };
}

module.exports = (passport) => {
   // used to serialize the user for the session
   passport.serializeUser((user, done) => {
      done(null, user);
   });

   // used to deserialize the user
   passport.deserializeUser((id, done) => {
      done(null, id);
   });

   passport.use(
      new TwitterStrategy(twitterAuth, (token, tokenSecret, profile, done) => {
         //  console.log(token, tokenSecret, profile);
         done(null, { token, tokenSecret, ...extractData(profile) });
      })
   );
};
