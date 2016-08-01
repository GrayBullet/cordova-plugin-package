var fs = require('fs');
var Promise = require('../promise');

/**
 * File node object.
 * @param {Object} pathInfo File path.
 * @constructor
 */
function File(pathInfo) {
  this.path = pathInfo;
  this.type = 'file';
}

File.prototype.remove = function () {
  var that = this;

  return new Promise(function (resolve, reject) {
    return fs.unlink(that.path.full, function (error) {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
};

module.exports = File;
