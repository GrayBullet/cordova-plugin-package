/** @namespace context.opts */
/** @namespace context.opts.cordova */

var Promise = require('./promise');
var Task = require('./builds/task');
var config = require('./config');

module.exports = function (context) {
  var c = config.load(context.opts.projectRoot);

  var options = {
    projectRoot: c.projectRoot,
    cordovaRoot: context.opts.projectRoot,
    platforms: context.opts.cordova.platforms,
    cmdLine: context.cmdLine,
    options: context.opts.options,
    build: context.opts.options.release ? 'release' : 'debug'
  };

  var tasks = options.platforms
    .map(function (platform) { return new Task(platform, options); })
    .map(function (task) { return task.invoke(); });

  return Promise.all(tasks);
};
