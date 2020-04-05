module.exports.sortObjByDesc = (obj, field = '') => {
   const res = Object.entries(obj)
      // .sort((a, b) => b[1][field] - a[1][field])
      .sort((a, b) => {
         if (field === '') return b[1] - a[1];
         return b[1][field] - a[1][field];
      })
      .slice(0, 10);
   return res;
};

module.exports.isLoggedIn = (req, res, next) => {
   // if user is authenticated in the session, carry on
   if (req.isAuthenticated()) return next();
   return res.redirect('/api/v1/auth');
};
