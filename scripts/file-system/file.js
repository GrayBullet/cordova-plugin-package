var Promise = require('../promise');
var util = require('./util');

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
  var pathInfo = this.path;

  return util.file.remove(pathInfo.full);
};

File.prototype.getChildren = function () {
  return Promise.resolve([]);
};

File.prototype.copy = function (dest, callback) {
  var that = this;
  var destPath = this.path.dest(dest);

  return util.file.copy(this.path.full, destPath)
    .then(function () {
      if (callback) {
        callback(destPath, that);
      }
    });
};

module.exports = File;
