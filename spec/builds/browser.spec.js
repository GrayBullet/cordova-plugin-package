var path = require('path');
var _ = require('underscore');
var Browser = require('../../scripts/builds/browser');
var DistManager = require('../../scripts/builds/dist-manager');

var copies = [];

/**
 * Make node from file or dir.
 * @param {Object} node File or dir.
 * @param {Object} [parent] Parent node
 * @return {Object} Node.
 */
function makeNode(node, parent) {
  return {
    node: node,
    relative: parent ? path.join(parent.relative, node.name) : '',
    children: function () {
      var that = this;
      return node.children.map(function (child) {
        return makeNode(child, that);
      });
    },
    find: function (pathname) {
      if (this.relative === pathname) {
        return makeNode(this.node);
      }

      return _.chain(this.children())
        .map(function (child) {
          return child.find(pathname);
        })
        .compact()
        .first()
        .value();
    },
    getChildren: function () {
      return Promise.resolve(this.children());
    },
    copy: function (dest) {
      copies.push({
        src: this.relative,
        dest: dest
      });
      return Promise.resolve();
    }
  };
}

/**
 * Create directory.
 * @param {String} name Directory name.
 * @param {Array} [children] Directory children.
 * @return {Object} Directory.
 */
function dir(name, children) {
  return {
    name: name,
    children: children || []
  };
}

/**
 * Create file.
 * @param {String} name File name.
 * @return {Object} File.
 */
function file(name) {
  return {
    name: name,
    children: []
  };
}

var root =
  dir('platforms', [
    dir('browser', [
      dir('build', [
        file('package.zip'),
        file('require.ignore')
      ]),
      file('index.html'),
      dir('cordova')
    ])
  ]);

var rootNode = makeNode(root);

describe('Browser', function () {
  describe('all', function () {
    it('files', function (done) {
      var dist = new DistManager({src: 'browser', dist: 'root'});
      spyOn(dist, 'createNode').and.callFake(function (pathname) {
        return Promise.resolve(rootNode.find(pathname));
      });

      var browser = new Browser(dist, {});

      browser.invoke()
        .then(function () {
          console.log('copy finished');
          expect(copies).toEqual([
            {src: 'package.zip', dest: 'root'}
          ]);
        })
        .then(done);
    });
  });
});
