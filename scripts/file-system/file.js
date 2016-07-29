var fs = require('fs');
var Promise = require('../promise');

/**
 * File node object.
 * @param {String} pathname File path.
 * @constructor
 */
function File(pathname) {
  this.path = pathname;
  this.type = 'file';
}

File.prototype.remove = function () {
  var that = this;

  return new Promise(function (resolve, reject) {
    return fs.unlink(that.path, function (error) {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
};

module.exports = File;
