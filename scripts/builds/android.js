var path = require('path');

var Android = function (dist, options) {
  this._options = options;

  this.dist = dist.chSrc(path.join('build', 'outputs', 'apk'));
};

Android.prototype.invoke = function () {
  var that = this;

  return this.dist
    .files(function (file) {
      return that.isApk(file);
    })
    .copy();
};

Android.prototype.isApk = function (file) {
  var build = this._options.build;

  if (build === 'debug') {
    return file.match(/.*-debug.*\.apk/);
  } else if (build === 'release') {
    return file.match(/.*-release.*\.apk/);
  }

  throw new Error('Invalid operation build type `' + build + '`');
};

module.exports = Android;
