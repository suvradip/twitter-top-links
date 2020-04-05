const router = require('express').Router();
const consola = require('consola');
const debug = require('debug')('server:api:v1:user.js');
const { User } = require('../../models');
// const UserInfo = require('../../controller/userInfo');
const isLoggedIn = require('../../middleware/authorization');

router.get('/', isLoggedIn, async (req, res) => {
   debug('Get /api/v1/users request received');

   const { userId } = req;
   try {
      User.find({ userName: userId })
         .lean()
         .then((data) => {
            debug('Message ready and sent.');
            res.json({
               message: 'OK',
               data: data[0],
            });
         });
   } catch (error) {
      consola.error(error.message);
      return res.json({
         message: 'Server Error',
         systemMessage: error.message,
      });
   }
});

// router.get('/update', async (req, res) => {
//    const userInstance = new UserInfo('abc');
//    const d = await userInstance.save({ name: 'cool' });
//    console.log('SAVE', d);
//    await userInstance.update({
//       topLinks: ['www.google1.com'],
//       name: 'World',
//    });

//    //  const r = await userInstance.find().lean();
//    res.json({
//       message: 'OK',
//       data: d,
//    });
// });

module.exports = router;
