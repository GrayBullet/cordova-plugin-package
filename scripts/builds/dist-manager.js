var path = require('path');
var Promise = require('../promise');
var Source = require('./source');
var Node = require('../file-system/node');

var DistManager = function (options) {
  this._options = options;
};

DistManager.prototype.srcFiles = function (src, filesOrFilter) {
  var options = this._options;

  var sources = options.sources = options.sources || [];
  sources.push(new Source(path.join(options.src, src), filesOrFilter, this.createNode));

  return this;
};

DistManager.prototype.copy = function () {
  var options = this._options;

  var copies = options.sources.map(function (source) {
    return source.copy(options.dist);
  });

  return Promise.all(copies);
};

DistManager.prototype.createNode = function (pathname) {
  return Node.create(pathname);
};

module.exports = DistManager;
