const debug = require('debug')('server:middleware:authorization.js');

module.exports = (req, res, next) => {
   debug('authorization middleware called.');

   let flag = false;
   let userId;
   if (req.headers.authorization) {
      const [, token] = req.headers.authorization.split(' ');
      if (typeof token !== 'undefined') {
         flag = true;
         userId = token;
      }
   }

   if (flag || req.isAuthenticated()) {
      req.userId = userId || req.user.username;
      return next();
   }

   return res.redirect('/api/v1/auth');
};
