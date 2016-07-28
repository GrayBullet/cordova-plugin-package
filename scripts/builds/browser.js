var Browser = function (dist, options) {
  this.options = options;

  this.dist = dist.chSrc('build');
};

Browser.prototype.invoke = function () {
  return this.dist
    .files(['package.zip'])
    .copy();
};

module.exports = Browser;
