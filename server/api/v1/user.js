const router = require('express').Router();
const consola = require('consola');
const debug = require('debug')('api:v1:user.js');
const { User } = require('../../models');

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

module.exports = router;
