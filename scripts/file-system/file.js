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

File.prototype.getChildren = function () {
  return Promise.resolve([]);
};


File.prototype.remove = function () {
  return util.file.remove(this.path.full);
};

File.prototype.copy = function (dest) {
  var destPath = this.path.dest(dest);

  return util.file.copy(this.path.full, destPath)
    .then(function () {
      return destPath;
    });
};

module.exports = File;
