var fs = require('fs');
var execFile = require('child_process').execFile;
var Promise = require('./promise');
var Node = require('./file-system/node');

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
  rmForceRecursive: function (dir) {
    return Node
      .get(dir)
      .then(function (node) {
        return node.remove();
      });
  }
};

module.exports = fsUtil;
