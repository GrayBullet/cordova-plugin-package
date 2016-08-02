var fs = require('fs');
var Promise = require('../promise');

/**
 * fs.readdir with Promise.
 * @param {String} dir Directory.
 * @return {Promise.<Array>} Files.
 */
function readdir(dir) {
  return new Promise(function (resolve, reject) {
    fs.readdir(dir, function (error, files) {
      if (error) {
        reject(error);
      } else {
        resolve(files);
      }
    });
  });
}

/**
 * Remove directory.
 * @param {String} dir Directory name.
 * @return {Promise} Promise object.
 */
function rmdir(dir) {
  return new Promise(function (resolve, reject) {
    fs.rmdir(dir, function (error) {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

/**
 * Make directory.
 * @param {string} dir Directory name.
 * @return {Promise} Promise object.
 */
function mkdir(dir) {
  return new Promise(function (resolve, reject) {
    fs.mkdir(dir, function (error) {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

/**
 * Copy directory.
 * @param {String} dir Directory.
 * @return {Promise} Promise object.
 */
function cpdir(dir) {
  return mkdir(dir)
    .catch(function (error) {
      if (error.code === 'EEXIST') {
        return;
      }
      return Promise.reject(error);
    });
}

/**
 * Invoke children.
 * @param {Function} func Invoke function.
 * @return {Promise} Promise object.
 */
function invokeChildren(func) {
  return this.getChildren()
    .then(function (children) {
      return children.reduce(function (prev, current) {
        return func(current);
      }, Promise.resolve());
    });
}

/**
 * Remove item.
 * @param {Object} item Item.
 * @return {Promise} Promise object.
 */
function remove(item) {
  return item.remove();
}

/**
 * Get node object.
 * @param {PathInfo} pathInfo Node path.
 * @return {Promise.<File|Directory>} File or Directory object.
 */
function get(pathInfo) {
  return require('./node').get(pathInfo);
}

/**
 * Get all node objects.
 * @param {Array.<PathInfo>} pathInfos Node paths.
 * @return {Promise.<Array.<File|Directory>>} File or Directory objects.
 */
function getAll(pathInfos) {
  return Promise.all(pathInfos.map(get));
}

/**
 * Directory node object.
 * @param {PathInfo} pathInfo File path.
 * @constructor
 */
function Directory(pathInfo) {
  this.path = pathInfo;
  this.type = 'directory';
}

Directory.prototype.getChildren = function () {
  var pathInfo = this.path;

  return readdir(pathInfo.full)
    .then(function (relatives) {
      return relatives.map(pathInfo.newPath.bind(pathInfo));
    })
    .then(getAll);
};

Directory.prototype.remove = function () {
  return Promise.resolve()
    .then(invokeChildren.bind(this, remove))
    .then(rmdir.bind(this, this.path.full));
};

Directory.prototype.copy = function (dest) {
  return cpdir(this.path.dest(dest));
};

module.exports = Directory;
