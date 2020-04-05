require('dotenv').config();
const express = require('express');
const consola = require('consola');
const bodyParser = require('body-parser');
const logger = require('morgan');
const passport = require('passport');
const session = require('express-session');
const path = require('path');

require('./config/passport')(passport); // pass passport for configuration

const apiRouter = require('./api');
require('./config/mongodb')();

const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
/*  parse: requested data in application/x-www-form-urlencoded */
app.use(bodyParser.urlencoded({ extended: false }));

app.use(
   session({
      secret: 'iLoveJavaScript', // session secret
      resave: true,
      saveUninitialized: true,
   })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, '..', 'build')));

app.use('/api', apiRouter);

const PORT = process.env.PORT || 8080;

app.listen(PORT);
consola.ready({
   message: `Server listening on http://localhost:${PORT}`,
   badge: true,
});
