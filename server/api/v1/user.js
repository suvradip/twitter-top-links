const router = require('express').Router();
const consola = require('consola');
const debug = require('debug')('api:v1:user.js');
const { User } = require('../../models');
const UserInfo = require('../../controller/userInfo');

router.get('/', async (req, res) => {
   debug('get /api/v1/users request received');
   try {
      User.find()
         .lean()
         .then((data) => {
            res.json({
               message: 'OK',
               data: data[0],
            });
         });
   } catch (error) {
      consola.error(error.message);
      res.json({
         message: 'Server Error',
         systemMessage: error.message,
      });
   }
});

router.get('/update', async (req, res) => {
   const userInstance = new UserInfo('abc');
   const d = await userInstance.save({ name: 'cool' });
   console.log('SAVE', d);
   await userInstance.update({
      topLinks: ['www.google1.com'],
      name: 'World',
   });

   //  const r = await userInstance.find().lean();
   res.json({
      message: 'OK',
      data: d,
   });
});

module.exports = router;
