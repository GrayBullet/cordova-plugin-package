var util = require('./util');
var Promise = require('../promise');

/**
 * Get children enumrator function.
 * @param {Node} node Node.
 * @returns {Function} Children enumerator function.
 */
function getChildren(node) {
  return function () {
    return node.getChildren();
  }
}

/**
 * Get invoker function by element.
 * @param {Function} func Invoke function.
 * @returns {Function} Invoker function.
 */
function forEach(func) {
  return function (children) {
    return children.reduce(function (prev, current) {
      return prev.then(function () {
        return func(current);
      });
    }, Promise.resolve());
  };
}

/**
 * Get remove node function.
 * @returns {Function} Remove node function.
 */
function remove() {
  return function (item) {
    return item.remove();
  }
}

/**
 * Get copy node function.
 * @param {String} dest Destination path.
 * @returns {Function} Copy node function.
 */
function copy(dest) {
  return function (item) {
    return item.copy(dest);
  }
}

/**
 * Get remove directory function.
 * @param {String} dir Remove directory.
 * @returns {Function} Remove directory function.
 */
function rmdir(dir) {
  return function () {
    return util.dir.rmdir(dir);
  }
}

/**
 * Get copy directory function.
 * @param {String} dir Destination directory.
 * @returns {Function} Copy directory function.
 */
function cpdir(dir) {
  return function () {
    return util.dir.cpdir(dir);
  }
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

  return util.dir.readdir(pathInfo.full)
    .then(function (relatives) {
      return relatives.map(pathInfo.newPath.bind(pathInfo));
    })
    .then(getAll);
};
Directory.prototype.remove = function () {
  var that = this;

  return Promise.resolve()
    .then(getChildren(this))
    .then(forEach(remove()))
    .then(rmdir(this.path.full));
};

Directory.prototype.copy = function (dest) {
  var destPath = this.path.dest(dest);

  return Promise.resolve()
    .then(cpdir(destPath))
    .then(getChildren(this))
    .then(forEach(copy(dest)))
    .then(function () {
      return destPath;
    });
};

module.exports = Directory;
