var util = require('./util');
var Promise = require('../promise');

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

  return util.dir.readdir(pathInfo.full)
    .then(function (relatives) {
      return relatives.map(pathInfo.newPath.bind(pathInfo));
    })
    .then(getAll);
};

Directory.prototype.remove = function () {
  return Promise.resolve()
    .then(invokeChildren.bind(this, remove))
    .then(util.dir.rmdir.bind(null, this.path.full));
};

Directory.prototype.copy = function (dest) {
  return util.dir.cpdir(this.path.dest(dest));
};

module.exports = Directory;
