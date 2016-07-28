var Unsupport = function (options) {
  this.options = options;
};

Unsupport.prototype.invoke = function () {
  console.log('Unsupport platform `' + this.options.platform + '`');
};

module.exports = Unsupport;
