const mongoose = require('mongoose');

const { Schema } = mongoose;

const schema = new Schema(
   {
      id: { type: Schema.ObjectId },
      name: { type: String },
      userName: { type: String, required: true, index: true },
      topLinks: { type: Schema.Types.Mixed, default: [] },
      topUsers: { type: Schema.Types.Mixed, default: [] },
   },
   {
      timestamps: true,
   }
);

schema.statics.findOneOrCreate = function findOneOrCreate(condition, doc) {
   const self = this;
   const newDocument = doc;
   return new Promise((resolve, reject) => {
      return self
         .findOne(condition)
         .then((result) => {
            if (result) {
               return resolve(result);
            }

            return self
               .create(newDocument)
               .then((data) => resolve(data))
               .catch((error) => reject(error));
         })
         .catch((error) => reject(error));
   });
};

module.exports = mongoose.model('User', schema);
