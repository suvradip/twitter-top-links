const mongoose = require('mongoose');
const consola = require('consola');

mongoose.set('useCreateIndex', true);

module.exports = async () => {
   const connection = await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
   });
   consola.info(`MongoDB connection Successful.`);

   //  await mongoose.connection.dropCollection('tweets');
   //  await mongoose.connection.dropCollection('users');
   //  consola.info('tweets & users collections are dropped.');
   return connection;
};
