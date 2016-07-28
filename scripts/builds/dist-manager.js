'use strict';

var path = require('path');
var util = require('../fs-util');
var Promise = require('../promise');

var DistManager = function (options) {
  this._options = options;
};

DistManager.prototype.chSrc = function (src) {
  this._options.src = path.join(this._options.src, src);
  return this;
};

DistManager.prototype.files = function (filesOrFilter) {
  var options = this._options;

  if (typeof filesOrFilter === 'function') {
    options.enumerator = function () {
      return util.readdir(options.src)
        .then(function (files) {
          return files.filter(filesOrFilter);
        });
    };
  } else {
    options.enumerator = function () {
      return Promise.resolve(filesOrFilter);
    };
  }

  return this;
};

DistManager.prototype.copy = function () {
  var that = this;

  return this._options.enumerator()
    .then(function (files) {
      return that.copyFiles(files);
    });
};

DistManager.prototype.copyFiles = function (files) {
  var that = this;

  var copies = files.map(function (file) {
    return that.copyFile(file);
  });
  return Promise.all(copies);
};

DistManager.prototype.copyFile = function (file) {
  var options = this._options;
  var src = path.join(options.src, file);
  var dest = path.join(options.dist, file);

  return util.copy(src, dest)
    .then(function () {
      console.log('Copy to ' + dest);
    });
};

module.exports = DistManager;
