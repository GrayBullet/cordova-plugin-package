var path = require('path');

/**
 * Make validate filename is apk function.
 * @param {String} build Buld type.
 * @return {Function} validator function.
 */
function makeIsApk(build) {
  return function (file) {
    if (build === 'debug') {
      return /.*-debug.*\.apk$/.test(file);
    } else if (build === 'release') {
      return /.*-release.*\.apk$/.test(file);
    }

    throw new Error('Invalid operation build type `' + build + '`');
  };
}

var Android = function (dist, options) {
  var isApk = makeIsApk(options.build);

  this.dist = dist
    .srcFiles('ant-build', isApk)
    .srcFiles(path.join('build', 'outputs', 'apk'), isApk);
};

Android.prototype.invoke = function () {
  return this.dist.copy();
};

module.exports = Android;
