var fs = require('fs');
var util = require('util');
var execFile = require('child_process').execFile;
var Promise = require('./promise');
var Node = require('./file-system/node');

var isArray = Array.isArray || util.isArray;

var fsUtil = {
  execFile: function (file, args, options) {
    return new Promise(function (resolve, reject) {
      execFile(file, args, options, function (error) {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  },
  mkdirp: function (dir) {
    return this.execFile('mkdir', ['-p', dir]);
  },
  copy: function (src, dest) {
    return this.execFile('cp', [src, dest]);
  },
  readdir: function (dir, options) {
    return new Promise(function (resolve, reject) {
      fs.readdir(dir, options, function (error, files) {
        if (error) {
          reject(error);
        } else {
          resolve(files);
        }
      });
    });
  },
  stat: function (node) {
    var that = this;

    if (isArray(node)) {
      var stats = node.map(function (n) {
        return that.stat(n);
      });
      return Promise.all(stats);
    }

    return new Promise(function (resolve, reject) {
      fs.stat(node, function (error, stats) {
        if (error) {
          reject(error);
        } else {
          stats.path = node;
          resolve(stats);
        }
      });
    });
  },
  rmForceRecursive: function (dir) {
    return Node
      .get(dir)
      .then(function (node) {
        return node.remove();
      });
  }
};

module.exports = fsUtil;
