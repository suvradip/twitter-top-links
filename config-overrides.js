/* eslint-disable no-param-reassign */

const path = require('path');
/**
 * Override create-react-app webpack configs without ejecting
 * https://github.com/timarney/react-app-rewired
 */
const clientDir = path.resolve(__dirname, 'client');
module.exports = {
   paths(paths) {
      paths.dotenv = path.join(clientDir, '.env');
      paths.appIndexJs = path.join(clientDir, 'index.js');
      paths.appSrc = path.join(clientDir);
      paths.appPublic = path.join(clientDir, 'public');
      paths.appHtml = path.join(clientDir, 'public', 'index.html');
      return paths;
   },
};
