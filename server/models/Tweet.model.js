const mongoose = require('mongoose');

const { Schema } = mongoose;

const schema = new Schema({
   tweetId: { type: Number, required: true, unique: true },
   tweetPostedBy: { type: String, required: true, index: true },
   text: { type: String, required: true },
   hashtags: [{ type: String }],
   urls: [{ url: String, expandedURL: String, displayURL: String }],
   userId: { type: Number, required: true },
   name: { type: String, required: true },
   location: { type: String },
   image: { type: String },
   createdAt: { type: String, required: true },
});

module.exports = mongoose.model('Tweet', schema);
