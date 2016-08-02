var Promise = require('../promise');

/**
 * Enumerate children and grandchildren.
 * @param {Array.<Node>} nodes Node list.
 * @return {Promise.<Array<Node>>} Children.
 */
function getChildren(nodes) {
  if (nodes.length <= 0) {
    return Promise.resolve([]);
  }

  return nodes.reduce(function (prev, current) {
    return prev.then(function (list) {
      return getNodes(current)
        .then(function (children) {
          return list.concat(children);
        });
    });
  }, Promise.resolve([]));
}

/**
 * Enumerate node.
 * @param {Node} node Root node.
 * @return {Promise.<Array<Node>>} Children.
 */
function getNodes(node) {
  var list = [node];

  return Promise.resolve()
    .then(function () {
      return node.getChildren();
    })
    .then(function (children) {
      return getChildren(children);
    })
    .then(function (grandchildren) {
      return list.concat(grandchildren);
    });
}

/**
 * Get relative path.
 * @param {Node} node Node.
 * @return {String} Relative path.
 */
function getRelative(node) {
  return node.relative || (node.path && node.path.relative);
}

/**
 * Node set object.
 * @param {Node} root Root node.
 * @constructor
 */
function NodeSet(root) {
  this.root = root;
  this.private = {};
}

NodeSet.prototype.getNodes = function () {
  var nodes = getNodes(this.root);

  var filter = this.private.filter;

  if (filter) {
    nodes = nodes.then(function (items) {
      return items.filter(function (item) {
        return filter(getRelative(item), item);
      });
    });
  }

  return nodes;
};

NodeSet.prototype.filter = function (filter) {
  this.private.filter = filter;

  return this;
};

NodeSet.prototype.copy = function (dest, callback) {
  // noinspection JSUnresolvedFunction
  return this.getNodes()
    .then(function (nodes) {
      if (nodes.length <= 0) {
        return Promise.resolve();
      }

      return nodes.reduce(function (prev, current) {
        return prev.then(function () {
          return current.copy(dest, callback);
        });
      }, Promise.resolve());
    }).catch(console.log);
};

module.exports = NodeSet;
