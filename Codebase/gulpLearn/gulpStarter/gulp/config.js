// Understanding module.exports and exports in Node.js
// http://www.sitepoint.com/understanding-module-exports-exports-node-js/

var src               = 'app';
var build             = 'build';
var development       = 'build/development';
var production        = 'build/production';
var srcAssets         = 'app/_assets';
var developmentAssets = 'build/assets';
var productionAssets  = 'build/production/assets';

//Method 1 : Success
module.exports = {

  configtester: {
    message: 'Hello World!!! from config file :)'
  },

  jshint: {
    src: srcAssets + '/javascripts/*.js'    
  }
  
};

//Method 2 : Success
// var exports = module.exports = {};

// exports.configtester = {
//     message: 'Hello World!!! from config file :)'
// };