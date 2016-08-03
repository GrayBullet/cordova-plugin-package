var path = require('path');

/**
 * Make is app function.
 * @param {String} device 'emulator' or 'device'.
 * @returns {Function} Is app function.
 */
function makeIsApp(device) {
  return function (file) {
    switch (device) {
      case 'emulator':
        return /^emulator\/.*\.app$/.test(file);

      case 'device':
        return /^device\/.*\.(app|ipa)$/.test(file);

      default:
        throw new Error('Unknown device `' + device + '`');
    }
  }
}

/**
 * iOS package environment.
 * @param {DistManager} dist Distribution manager.
 * @param {Object} options Options.
 * @constructor
 */
function IOs(dist, options) {
  this.dist = dist;

  this.dist = this.dist
    .srcFiles(path.join('build'), makeIsApp(options.device));
}

IOs.prototype.invoke = function () {
  return this.dist.copy();
};

module.exports = IOs;
