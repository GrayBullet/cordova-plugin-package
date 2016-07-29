var path = require('path');
var _ = require('underscore');
var Node = require('../../scripts/file-system/node');

/**
 * Convert object
 * @param {Array} children Array.
 * @return {Object} convert object.
 */
function convert(children) {
  return _.chain(children)
    .map(function (child) {
      return {path: child.path, type: child.type};
    })
    .sortBy(function (child) {
      return child.path;
    })
    .value();
}

// noinspection JSUnresolvedFunction
describe('Node', function () {
  // noinspection JSUnresolvedFunction
  describe('getChildren', function () {
    // noinspection JSUnresolvedFunction
    it('Enumrate children', function (done) {
      Node.get(path.join(__dirname, 'test1'))
        .then(function (target) {
          return target.getChildren();
        })
        .then(function (children) {
          var result = convert(children);

          // noinspection JSUnresolvedFunction
          expect(result).toEqual([
            {path: path.join(__dirname, 'test1', 'dir13'), type: 'directory'},
            {path: path.join(__dirname, 'test1', 'dir14'), type: 'directory'},
            {path: path.join(__dirname, 'test1', 'file11'), type: 'file'},
            {path: path.join(__dirname, 'test1', 'file12'), type: 'file'}
          ]);
        })
        .then(done);
    });
  });
});
