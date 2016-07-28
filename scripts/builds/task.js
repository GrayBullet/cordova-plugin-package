var path = require('path');
var Promise = require('../promise');
var util = require('../fs-util');
var DistManager = require('./dist-manager');
var Android = require('./android');
var Browser = require('./browser');
var Unsupport = require('./unsupport');

var Task = function (platform, options) {
  this.platform = platform;
  this.options = {
    build: options.build,
    cordovaRoot: options.cordovaRoot,
    platform: platform,
    platformRoot: path.join(options.cordovaRoot, 'platforms', platform),
    platformDist: path.join(options.projectRoot, 'dist', platform),
    options: options
  };
};

Task.prototype.invoke = function () {
  var that = this;

  return Promise.resolve()
    .then(function () { return util.rmForceRecursive(that.options.platformDist); })
    .then(function () { return util.mkdirp(that.options.platformDist); })
    .then(function () { return that.getPlatformTask().invoke(); });
};

Task.prototype.getPlatformTask = function () {
  var dist = new DistManager({
    src: this.options.platformRoot,
    dist: this.options.platformDist
  });

  switch(this.platform) {
  case 'android':
    return new Android(dist, this.options);

  case 'browser':
    return new Browser(dist, this.options);

  default:
    return new Unsupport(dist, this.options);
  }
};

module.exports = Task;
