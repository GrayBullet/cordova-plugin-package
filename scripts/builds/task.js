var path = require('path');
var Promise = require('../promise');
var util = require('../fs-util');
var DistManager = require('./dist-manager');
var Android = require('./android');
var Browser = require('./browser');
var Unsupport = require('./unsupport');

var Task = function (platform, options) {
  this._platform = platform;
  this._options = {
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
  var options = this._options;

  return Promise.resolve()
    .then(function () {
      return util.rmForceRecursive(options.platformDist);
    })
    .then(function () {
      return util.mkdirp(options.platformDist);
    })
    .then(function () {
      return that.getPlatformTask().invoke();
    });
};

Task.prototype.getPlatformTask = function () {
  var options = this._options;

  var dist = new DistManager({
    src: options.platformRoot,
    dist: options.platformDist
  });

  switch (this._platform) {
    case 'android':
      return new Android(dist, options);

    case 'browser':
      return new Browser(dist, options);

    default:
      return new Unsupport(dist, options);
  }
};

module.exports = Task;
