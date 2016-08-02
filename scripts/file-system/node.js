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

NullNode.prototype.getChildren = function () {
  return Promise.resolve([]);
};

/**
 * Path information.
 * @constructor
 */
function PathInfo() {
}

PathInfo.prototype.dest = function (dest) {
  return path.join(dest, this.relative);
};

PathInfo.prototype.newPath = function (relative) {
  var info = new PathInfo();
  info.basedir = this.basedir;
  info.relative = path.join(this.relative, relative);
  info.full = path.join(info.basedir, info.relative);

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
  this.relative = '';
  this.path = {};

  throw new Error('Do not create node instance.');
}

Node.prototype.getChildren = function () {
  throw new Error('Require implement');
};

Node.get = function (pathInfo) {
  return create(pathInfo);
};

Node.create = function (pathname) {
  return Node.get(PathInfo.create(pathname));
};

Node.filesSet = function (pathname, optFilter) {
  if (typeof optFilter !== 'function') {
    return;
  }

  var filter = optFilter || function () {
    return true;
  };

  return {
    copy: function (dest) {
      return Node.create(pathname)
        .then(function (root) {
          return root.filter(filter);
        })
        .then(function (nodes) {
          if (nodes.length <= 0) {
            return [];
          }

          return nodes.reduce(function (prev, current) {
            return prev.then(current.copy.bind(current, dest));
          }, Promise.resolve());
        });
    }
  };
};

module.exports = Node;
