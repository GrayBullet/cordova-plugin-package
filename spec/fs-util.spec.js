var util = require('../scripts/fs-util');

// noinspection JSUnresolvedFunction
describe('fsUtil', function () {
  // noinspection JSUnresolvedFunction
  describe('followPath', function () {
    // noinspection JSUnresolvedFunction
    it('follow path', function () {
      var result = util.followPath('/a/b/cde/fg/');

      // noinspection JSUnresolvedFunction
      expect(result).toEqual([
        '/',
        '/a',
        '/a/b',
        '/a/b/cde',
        '/a/b/cde/fg'
      ]);
    });
  });
});
