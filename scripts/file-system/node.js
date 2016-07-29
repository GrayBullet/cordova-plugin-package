var fs = require('fs');
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
 * Create node.
 * @param {String} pathname Node path.
 * @return {File|Directory} Fire or directory.
 */
function create(pathname) {
  return stat(pathname)
    .then(function (stats) {
      if (stats.isDirectory()) {
        return new Directory(pathname);
      }
      if (stats.isFile()) {
        return new File(pathname);
      }

      // noinspection JSUnresolvedFunction
      return Promise.reject(new Error('Unspported node type.'));
    });
}

/**
 * Node.
 * @constructor
 */
function Node() {
  throw new Error('Do not create node instance.');
}

Node.get = function (pathname) {
  return create(pathname);
};

module.exports = Node;
