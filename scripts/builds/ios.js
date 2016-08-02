var path = require('path');

function isApp(file) {
  return /^emulator\/.*\.app$/.test(file);
}

var IOs = function (dist, options) {
  this.dist = dist;

  if (options.device === 'emulator') {
    this.dist = this.dist
      .srcFiles(path.join('build'), isApp);
  }
};

IOs.prototype.invoke = function () {
  return this.dist.copy();
};

module.exports = IOs;
