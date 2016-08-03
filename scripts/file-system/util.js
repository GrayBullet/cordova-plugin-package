var fs = require('fs');
var path = require('path');
var Promise = require('../promise');

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
 * Follow path.
 * @param {String} dir Directory.
 * @return {Array.<String>} Parent paths.
 */
function followPath(dir) {
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
}

/**
 * Run chmod.
 * @param {String} pathname Path.
 * @param {String} mode File permission mode.
 * @return {Promise} Promise object.
 */
function chmod(pathname, mode) {
  return new Promise(function (resolve, reject) {
    fs.chmod(pathname, mode, function (error) {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

/**
 * mkdir -p
 * @param {String} dir Directory.
 * @param {NUmber} mode Permission mode.
 * @return {Promise} Promise object.
 */
function mkdirp(dir, mode) {
  return followPath(dir)
    .reduce(function (prev, current) {
      return prev.then(function () {
        return mkdir(current, {mode: mode});
      });
    }, Promise.resolve());
}

/**
 * Copy file.
 * @param {String} src Source path.
 * @param {String} dest Destination path.
 * @param {Number} mode File permission mode.
 * @return {Promise} Promise object.
 */
function cp(src, dest, mode) {
  return new Promise(function (resolve, reject) {
    fs.createReadStream(src)
      .pipe(fs.createWriteStream(dest, {mode: mode}))
      .on('close', resolve)
      .on('error', reject);
  });
}

/**
 * Copy file
 * @param {String} src Source file.
 * @param {String} dest Destination file.
 * @return {Promise} Promise object.
 */
function copy(src, dest) {
  var destDir = path.dirname(dest);

  return mkdirp(destDir)
    .then(function () {
      return stat(src);
    })
    .then(function (stats) {
      return cp(src, dest, stats.mode & parseInt('777', 8));
    });
}

/**
 * Unlink file.
 * @param {String} file File path.
 * @return {Promise} Promise object.
 */
function unlink(file) {
  return new Promise(function (resolve, reject) {
    return fs.unlink(file, function (error) {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

/**
 * fs.readdir with Promise.
 * @param {String} dir Directory.
 * @return {Promise.<Array>} Files.
 */
function readdir(dir) {
  return new Promise(function (resolve, reject) {
    fs.readdir(dir, function (error, files) {
      if (error) {
        reject(error);
      } else {
        resolve(files);
      }
    });
  });
}

/**
 * Remove directory.
 * @param {String} dir Directory name.
 * @return {Promise} Promise object.
 */
function rmdir(dir) {
  return new Promise(function (resolve, reject) {
    fs.rmdir(dir, function (error) {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

/**
 * Copy directory.
 * @param {String} src Source directory.
 * @param {String} dest Destination directory.
 * @return {Promise} Promise object.
 */
function cpdir(src, dest) {
  // noinspection JSUnresolvedFunction
  return stat(src)
    .then(function (stats) {
      return mkdirp(dest, stats.mode)
        .catch(function (error) {
          if (error.code === 'EEXIST') {
            return;
          }
          // noinspection JSUnresolvedFunction
          return Promise.reject(error);
        });
    });
}

module.exports = {
  followPath: followPath, // テストを書く
  stat: stat,
  file: {
    copy: copy,
    remove: unlink
  },
  dir: {
    mkdir: mkdir,
    mkdirp: mkdirp,
    readdir: readdir,
    rmdir: rmdir,
    cpdir: cpdir
  }
};
