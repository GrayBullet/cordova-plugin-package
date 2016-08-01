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
 * Remove item.
 * @param {Object} item Item.
 * @return {Promise} Promise object.
 */
function remove(item) {
  return item.remove();
}

/**
 * Remove all items.
 * @param {Array} items Items.
 * @return {Promise} Promise object.
 */
function removeAll(items) {
  return Promise.all(items.map(remove));
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

Directory.prototype.rmdir = function () {
  return rmdir(this.path.full);
};

Directory.prototype.removeChildren = function () {
  return this.getChildren().then(removeAll);
};

Directory.prototype.remove = function () {
  return Promise.resolve()
    .then(this.removeChildren.bind(this))
    .then(this.rmdir.bind(this));
};

module.exports = Directory;
