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
 * @param {Function} createNode Node.create function.
 * @constructor
 */
function Source(src, filter, createNode) {
  this.nodeSet = function () {
    return createNode(src)
      .then(function (node) {
        return new NodeSet(node).filter(filter);
      });
  };
}

Source.prototype.copy = function (dest) {
  if (this.nodeSet) {
    return this.nodeSet()
      .then(function (nodeSet) {
        return nodeSet.copy(dest, displayCopied);
      });
  }
};

module.exports = Source;
