var Node = require('../file-system/node');
var NodeSet = require('../file-system/node-set');

/**
 * Show copied file message
 * @param {String} file File name.
 */
function displayCopied(file) {
  console.log('Copy to ' + file);
}

/**
 * Source files
 * @param {String} src Source directory.
 * @param {Function} filter Filter function.
 * @constructor
 */
function Source(src, filter) {
  this.nodeSet = function () {
    return Node.create(src)
      .then(function (node) {
        return new NodeSet(node).filter(filter);
      });
  };
}

Source.prototype.copy = function (dest) {
  if (this.nodeSet) {
    return this.nodeSet()
      .then(function (nodeSet) {
        nodeSet.copy(dest, displayCopied);
      });
  }
};

module.exports = Source;
