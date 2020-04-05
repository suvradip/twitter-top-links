const router = require('express').Router();
const cors = require('cors');

const v1Routes = require('./v1');

/**
 * to check status of apis
 */
router.all('/', (req, res) =>
   res.json({
      message: 'APIs are working fine.',
   })
);

/**
 * API v1 version
 */
router.use('/v1', cors(), v1Routes);

module.exports = router;
