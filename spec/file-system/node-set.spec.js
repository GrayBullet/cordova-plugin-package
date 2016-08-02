var _ = require('underscore');
var NodeSet = require('../../scripts/file-system/node-set');

/**
 * Convert to test object from node.
 * @param {Node} node Node object.
 * @return {Object} test object.
 */
function convert(node) {
  if (_.isArray(node)) {
    return node.map(convert);
  }

  return node.relative;
}

/**
 * Convert to node like.
 * @param {Object} o Object.
 * @return {Object} Node like object.
 */
function makeNode(o) {
  o.getChildren = function () {
    return Promise.resolve(o.children || []);
  };

  if (o.children) {
    o.children.forEach(makeNode);
  }

  return o;
}

describe('NodeSet', function () {
  describe('fromRoot', function () {
    it('root only', function (done) {
      var o = {
        relative: 'item1'
      };

      var target = new NodeSet(makeNode(o));

      target.getNodes()
        .then(function (nodes) {
          var result = convert(nodes);
          expect(result).toEqual([
            'item1'
          ]);
        })
        .then(done);
    });

    it('has children', function (done) {
      var o = {
        relative: 'item1',
        children: [
          {relative: 'item2'},
          {relative: 'item3'}
        ]
      };

      var target = new NodeSet(makeNode(o));

      target.getNodes()
        .then(function (nodes) {
          var result = convert(nodes);
          expect(result).toEqual([
            'item1',
            'item2',
            'item3'
          ]);
        })
        .then(done);
    });

    it('has grandchildren', function (done) {
      var o = {
        relative: 'item1',
        children: [
          {
            relative: 'item2',
            children: [
              {relative: 'item3'},
              {relative: 'item4'}
            ]
          },
          {relative: 'item5'}
        ]
      };

      var target = new NodeSet(makeNode(o));

      target.getNodes()
        .then(function (nodes) {
          var result = convert(nodes);
          expect(result).toEqual([
            'item1',
            'item2',
            'item3',
            'item4',
            'item5'
          ]);
        })
        .then(done);
    });
  });
});
