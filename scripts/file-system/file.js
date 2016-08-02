var fs = require('fs');
var Promise = require('../promise');

/**
 * Copy file.
 * @param {String} src Source path.
 * @param {String} dest Destination path.
 * @return {Promise} Promise object.
 */
function cp(src, dest) {
  return new Promise(function (resolve, reject) {
    fs.createReadStream(src)
      .pipe(fs.createWriteStream(dest))
      .on('close', resolve)
      .on('error', reject);
  });
}

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

  return new Promise(function (resolve, reject) {
    return fs.unlink(pathInfo.full, function (error) {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
};

File.prototype.getChildren = function () {
  return Promise.resolve([]);
};

File.prototype.copy = function (dest, callback) {
  var that = this;
  var destPath = this.path.dest(dest);

  return cp(this.path.full, this.path.dest(dest))
    .then(function () {
      if (callback) {
        callback(destPath, that);
      }
    });
};

module.exports = File;
