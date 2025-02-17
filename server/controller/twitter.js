/**
 * Helps to fetch twitter data and save in db
 */
const Twit = require('twit');
const consola = require('consola');
const debug = require('debug')('server:controller:twitter.js');
const { Tweet } = require('../models');
const { sortObjByDesc } = require('../util');
const UserInfo = require('./userInfo');

class Twitter {
   constructor({ username, userToken, userSecretToken, lastId }) {
      this.twitterUserId = username;
      /* Authentications of twitter api */
      this.twitInstance = new Twit({
         consumer_key: process.env.CONSUMER_API_KEY,
         consumer_secret: process.env.CONSUMER_API_SECRET_KEY,
         access_token: userToken,
         access_token_secret: userSecretToken,
      });

      /* 7 days */
      this.lastDate = new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000);

      this.links = {};
      this.users = {};
      this.lastId = undefined;
      this.lastTweetId = Number(lastId);
   }

   doWork() {
      debug('Twitter data fetching started.');
      this.promises = [];
      return new Promise((resolve, reject) => {
         Promise.all([this.fetch()])
            .then(() => resolve())
            .catch((e) => reject(e));
      });
   }

   async fetch() {
      debug('lastId', this.lastId);
      const { data } = await this.twitInstance.get('statuses/home_timeline', {
         include_entities: true,
         count: 200,
         max_id: this.lastId,
      });

      const tweets = this.sanitize(data);

      await Twitter.saveUserInfo(this.twitterUserId, {
         topLinks: sortObjByDesc(this.links),
         topUsers: sortObjByDesc(this.users, 'count'),
         lastTweetId: this.lastId,
      });

      if (tweets.length > 0) {
         const p = await this.fetch();
         return p;
      }

      // await Twitter.saveUserInfo(this.twitterUserId, {
      //    topLinks: sortObjByDesc(this.links),
      //    topUsers: sortObjByDesc(this.users, 'count'),
      //    lastTweetId: this.lastId,
      // });
      return true;
   }

   sanitize(tweets) {
      debug('sanitization start');
      const totalTweets = tweets.length;
      if (totalTweets === 0) return false;

      this.lastId = tweets[totalTweets - 1].id;
      const validTweets = [];

      for (let i = 0; i < totalTweets; i += 1) {
         const tweet = tweets[i];
         const createdAt = new Date(tweet.created_at);
         if (tweet.id === this.lastTweetId) {
            consola.info('Old tweets found in DB');
            break;
         }

         /* if tweet is older more than 7 days then discard it */
         if (createdAt > this.sinceDate || tweet.entities.urls.length > 0) {
            const tweetPostedBy = tweet.user.screen_name;
            // eslint-disable-next-line camelcase
            const { id, name, profile_image_url_https } = tweet.user;
            const tweetFilter = {
               urls: [],
               hashtags: [],
               location: tweet.place ? tweet.place.full_name : null,
               userId: id,
               tweetId: tweet.id,
               text: tweet.text,
               createdAt,
               name,
               tweetPostedBy,
               image: profile_image_url_https,
               twitterUserId: this.twitterUserId,
            };

            if (Object.hasOwnProperty.call(this.users, tweetPostedBy)) {
               this.users[tweetPostedBy].count += 1;
            } else {
               this.users[tweetPostedBy] = { count: 1, image: profile_image_url_https };
            }

            /* urls filtering */
            tweetFilter.urls = tweet.entities.urls.map((url) => {
               const { hostname } = new URL(url.expanded_url);
               if (Object.hasOwnProperty.call(this.links, hostname)) {
                  this.links[hostname] += 1;
               } else {
                  this.links[hostname] = 1;
               }

               return {
                  url: url.url,
                  expandedURL: url.expanded_url,
                  displayURL: url.display_url,
               };
            });

            /* hashtags filtering */
            tweetFilter.hashtags = tweet.entities.hashtags.map((tag) => `#${tag.text}`);

            validTweets.push(tweetFilter);
         }
      }

      /* saving to database */
      Twitter.saveTweets(validTweets);
      debug('sanitization completed');
      return validTweets;
   }

   static async saveTweets(tweets) {
      console.log('tweets', tweets.length);
      if (tweets.length === 0) return false;
      try {
         await Tweet.insertMany(tweets, { ordered: false });
         consola.info(`${tweets.length} tweets saved to db`);
         return true;
      } catch (error) {
         /* 11000: duplicate records */
         if (error.code === 11000) {
            consola.info('Duplicate data');
         } else {
            consola.error(`Error produced during data save.`);
         }
         return false;
      }
   }

   static async saveUserInfo(userName, { topLinks = [], topUsers = [], lastTweetId }) {
      try {
         const user = new UserInfo(userName);
         await user.update({ topLinks, topUsers, lastTweetId });
      } catch (error) {
         consola.error(`Tweets pulling api error for user update:: ${userName}`);
         consola.error(error);
      }
   }
}

module.exports = Twitter;
