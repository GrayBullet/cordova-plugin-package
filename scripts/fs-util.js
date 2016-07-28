var fs = require('fs');
var path = require('path');
var execFile = require('child_process').execFile;
var Promise = require('./promise');

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
    return this.execFile('rm', ['-rf', dir]);
  }
};

module.exports = fsUtil;
