const User = require('../models/User.model');

class UserInfo {
   constructor(userName) {
      this.userName = userName;
   }

   async save({ name, photo }) {
      return User.findOneOrCreate(
         { userName: this.userName },
         { userName: this.userName, ...(name && { name }), ...(photo && { photo }) }
      );
   }

   update({ topLinks, topUsers, name, photo, lastTweetId }) {
      return User.updateOne(
         { userName: this.userName },
         {
            ...(name && { name }),
            ...(photo && { photo }),
            ...(topLinks && { topLinks }),
            ...(topUsers && { topUsers }),
            ...(lastTweetId && { lastTweetId }),
         }
      );
   }

   find(otherUser = '') {
      return User.find({ userName: otherUser || this.userName });
   }
}

module.exports = UserInfo;
