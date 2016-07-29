var fs = require('fs');
var path = require('path');
var execFile = require('child_process').execFile;
var Promise = require('./promise');
var Node = require('./file-system/node');

/**
 * Make directory.
 * @param {String} dir Directory.
 * @return {Promise} Promise object.
 */
function mkdir(dir) {
  return new Promise(function (resolve, reject) {
    fs.mkdir(dir, function (error) {
      if (error && (error.code !== 'EEXIST')) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

/**
 * Make directory.
 * @param {String} src Source file.
 * @param {String} dest Destination file.
 * @return {Promise} Promise object.
 */
function copy(src, dest) {
  return new Promise(function (resolve, reject) {
    fs.createReadStream(src)
      .pipe(fs.createWriteStream(dest))
      .on('close', resolve)
      .on('error', reject);
  });
}

var fsUtil = {
  followPath: function (dir) {
    var list = [];
    var temp = path.join(dir, 'temporary');
    temp = path.dirname(temp);

    while (true) { // eslint-disable-line no-constant-condition
      var prev = temp;
      temp = path.dirname(temp);
      if (prev === temp) {
        return list;
      }

      list.unshift(prev);
    }
  },
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
    return this.followPath(dir)
      .reduce(function (prev, current) {
        return prev.then(function () {
          return mkdir(current);
        });
      }, Promise.resolve());
  },
  copyFile: function (file, srcDir, destDir) {
    var srcFile = path.join(srcDir, file);
    var destFile = path.join(destDir, file);

    var that = this;

    return Promise.resolve()
      .then(function () {
        return that.mkdirp(path.dirname(srcFile));
      })
      .then(function () {
        return copy(srcFile, destFile);
      })
      .then(function () {
        return destFile;
      });
  },
  readdir: function (dir) {
    return new Promise(function (resolve, reject) {
      fs.readdir(dir, function (error, files) {
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
