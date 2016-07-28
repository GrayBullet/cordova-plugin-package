var fs = require('fs');
var path = require('path');

function loadConfig(dir) {
  var file = path.join(dir, '.cordova-clirc');

  try {
    return fs.readFileSync(file, 'utf-8');
  } catch (ex) {
    if (ex.code === 'ENOENT') {
      return;
    }

    throw ex;
  }
}

function exists(dir) {
  try {
    return fs.statSync(dir).isDirectory();
  } catch (ex) {
    if (ex.code === 'ENOENT') {
      return;
    }

    throw ex;
  }
}

function findProjectRoot(dir) {
  var temp = dir;

  while (true) {
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
