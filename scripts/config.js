var fs = require('fs');
var path = require('path');

/**
 * Load config file.
 * @param {String} dir Directory includes config file.
 * @return {Object|undefined} Config data.
 */
function loadConfig(dir) {
  var file = path.join(dir, '.cordova-clirc');

  try {
    return fs.readFileSync(file, 'utf-8');
  } catch (ex) {
    if (ex.code === 'ENOENT') {
      return undefined;
    }

    throw ex;
  }
}

/**
 * Exists directory.
 * @param {String} dir Directory name.
 * @return {Boolean} Directory exists.
 */
function exists(dir) {
  try {
    return fs.statSync(dir).isDirectory();
  } catch (ex) {
    if (ex.code === 'ENOENT') {
      return false;
    }

    throw ex;
  }
}

/**
 * Find project root directory.
 * @param {String} dir Start directory.
 * @return {String|undefined} project root.
 */
function findProjectRoot(dir) {
  var temp = dir;

  while (true) { // eslint-disable-line no-constant-condition
    var nodeModules = path.join(temp, 'node_modules');
    if (exists(nodeModules)) {
      return temp;
    }

    var parent = path.dirname(temp);
    if (parent === temp) {
      return dir;
    }

    temp = parent;
  }
}

module.exports = {
  load: function (optDir) {
    var dir = optDir || process.cwd();

    var config = loadConfig(dir) || {};
    config.projectRoot = findProjectRoot(dir);
    return config;
  }
};
