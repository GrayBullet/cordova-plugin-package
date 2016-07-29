var util = require('../fs-util');
var Promise = require('../promise');

/**
 * Call readdir.
 * @param {String} dir Directory.
 * @return {Promise.<Array>} File names.
 */
function readdir(dir) {
  // noinspection JSUnresolvedFunction
  return util.readdir(dir)
    .then(function (files) {
      return files;
    })
    .catch(function (error) {
      if (error.code === 'ENOENT') {
        return [];
      }
      // noinspection JSUnresolvedFunction
      return Promise.reject(error);
    });
}

/**
 * Get file enumerator.
 * @param {String} dir Directory.
 * @param {Array|Function} filesOrFilter File names array or filterfunction.
 * @return {Function} Enumerator function.
 */
function getEnumerator(dir, filesOrFilter) {
  if (typeof filesOrFilter === 'function') {
    return function () {
      return readdir(dir)
        .then(function (files) {
          return files.filter(filesOrFilter);
        });
    };
  }
  return function () {
    return Promise.resolve(filesOrFilter);
  };
}

/**
 * Show copied file message
 * @param {String} file File name.
 */
function displayCopied(file) {
  console.log('Copy to ' + file);
}

/**
 * Copy file.
 * @param {String} file File name.
 * @param {String} src Source directory name.
 * @param {String} dest Destination directory name.
 * @return {Promise} Promise object.
 */
function copyFile(file, src, dest) {
  return util.copyFile(file, src, dest)
    .then(displayCopied);
}

/**
 * Copy files.
 * @param {Array.<String>} files File names.
 * @param {String} src Source directory name.
 * @param {String} dest Destination directory name.
 * @return {Promise} Promise object.
 */
function copyFiles(files, src, dest) {
  var copies = files.map(function (file) {
    return copyFile(file, src, dest);
  });

  return Promise.all(copies);
}

/**
 * Source files
 * @param {String} src Source directory.
 * @param {Array|Function} filesOrFilter File names array or filter function.
 * @constructor
 */
function Source(src, filesOrFilter) {
  this.src = src;
  this.enumerator = getEnumerator(src, filesOrFilter);
}

Source.prototype.copy = function (dest) {
  var src = this.src;

  return this.enumerator()
    .then(function (files) {
      return copyFiles(files, src, dest);
    });
};

module.exports = Source;
