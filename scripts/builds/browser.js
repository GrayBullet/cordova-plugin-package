var Browser = function (dist, options) {
  this._options = options;

  this.dist = dist.chSrc('build');
};

Browser.prototype.invoke = function () {
  return this.dist
    .files(['package.zip'])
    .copy();
};

module.exports = Browser;
