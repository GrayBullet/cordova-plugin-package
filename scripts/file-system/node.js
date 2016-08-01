var fs = require('fs');
var path = require('path');
var Promise = require('../promise');
var Directory = require('./directory');
var File = require('./file');

/**
 * fs.stat with Promise.
 * @param {String} pathname pathname.
 * @return {Promise.<fs.Stats>} stats.
 */
function stat(pathname) {
  return new Promise(function (resolve, reject) {
    fs.stat(pathname, function (error, stats) {
      if (error) {
        reject(error);
      } else {
        resolve(stats);
      }
    });
  });
}

/**
 * Null object node.
 * @constructor
 */
function NullNode() {
}

NullNode.prototype.remove = function () {
};

/**
 * Path information.
 * @constructor
 */
function PathInfo() {
}

PathInfo.prototype.newPath = function (relative) {
  var info = new PathInfo();
  info.basedir = this.basedir;
  info.relative = relative;
  info.full = path.join(info.basedir, relative);

  return info;
};

PathInfo.create = function (pathname) {
  var info = new PathInfo();
  info.basedir = pathname;
  info.relative = '';
  info.full = pathname;
  return info;
};

/**
 * Create node.
 * @param {PathInfo} pathInfo Node path.
 * @return {File|Directory} Fire or directory.
 */
function create(pathInfo) {
  // noinspection JSUnresolvedFunction
  return stat(pathInfo.full)
    .then(function (stats) {
      if (stats.isDirectory()) {
        return new Directory(pathInfo);
      }
      if (stats.isFile()) {
        return new File(pathInfo);
      }

      // noinspection JSUnresolvedFunction
      return Promise.reject(new Error('Unspported node type.'));
    })
    .catch(function (error) {
      if (error.code === 'ENOENT') {
        return new NullNode(pathInfo);
      }

      // noinspection JSUnresolvedFunction
      return Promise.reject(error);
    });
}

/**
 * Node.
 * @constructor
 */
function Node() {
  throw new Error('Do not create node instance.');
}

Node.get = function (pathInfo) {
  return create(pathInfo);
};

Node.create = function (pathname) {
  return Node.get(PathInfo.create(pathname));
};

module.exports = Node;
