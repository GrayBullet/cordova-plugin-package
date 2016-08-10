/**
 * Is file zip?
 * @param {String} file filename.
 * @return {boolean} Is zip file.
 */
function isZip(file) {
  return file === 'package.zip';
}

var Browser = function (dist, options) {
  this._options = options;

  this.dist = dist.srcFiles('build', isZip);
};

Browser.prototype.invoke = function () {
  return this.dist.copy();
};

module.exports = Browser;
