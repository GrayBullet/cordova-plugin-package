var Unsupport = function (dist, options) {
  this._options = options;
};

Unsupport.prototype.invoke = function () {
  console.log('Unsupport platform `' + this._options.platform + '`');
};

module.exports = Unsupport;
