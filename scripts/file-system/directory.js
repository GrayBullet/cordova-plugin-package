var fs = require('fs');
var path = require('path');
var Promise = require('../promise');

/**
 * fs.readdir with Promise.
 * @param {String} pathname pathname.
 * @return {Promise.<Array>} files.
 */
function readdir(pathname) {
  return new Promise(function (resolve, reject) {
    fs.readdir(pathname, function (error, files) {
      if (error) {
        reject(error);
      } else {
        resolve(files);
      }
    });
  });
}

/**
 * Path join base directory.
 * @param {String} basedir Base directory.
 * @return {Function} Join base directory function.
 */
function pathJoin(basedir) {
  return function (files) {
    return files.map(function (file) {
      return path.join(basedir, file);
    });
  };
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
 * @param {String} pathname Node path.
 * @return {Promise.<File|Directory>} File or Directory object.
 */
function get(pathname) {
  return require('./node').get(pathname);
}

/**
 * Get all node objects.
 * @param {Array.<String>} pathnames Node paths.
 * @return {Promise.<Array.<File|Directory>>} File or Directory objects.
 */
function getAll(pathnames) {
  return Promise.all(pathnames.map(get));
}

/**
 * Directory node object.
 * @param {String} pathname File path.
 * @constructor
 */
function Directory(pathname) {
  this.path = pathname;
  this.type = 'directory';
}

Directory.prototype.getChildren = function () {
  return readdir(this.path)
    .then(pathJoin(this.path))
    .then(getAll);
};

Directory.prototype.rmdir = function () {
  return rmdir(this.path);
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
