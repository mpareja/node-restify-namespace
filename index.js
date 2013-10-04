var methods = [
  'del',  'get', 'head', 'opts', 'post', 'put', 'patch'
];

module.exports = function (app, prefix, callback) {
  var originals = {};
  methods.forEach(function (method) {
    var orig = originals[method] = app[method];
    app[method] = function () {
      var args = Array.prototype.slice.call(arguments, 0),
        arg = args[0],
        regexMsg = 'Regular expression route support is not implemented';

      if (typeof arg === 'string') {
        args[0] = prefix + arg;
      } else if (arg instanceof RegExp) {
        throw new Error(regexMsg);
      } else if (typeof arg === 'object') {
        if (typeof arg.path === 'string') {
          arg.path = prefix + arg.path;
        } else if (arg.path instanceof RegExp) {
          throw new Error(regexMsg);
        }
      }
      orig.apply(this, args);
    };
  });

  callback();

  methods.forEach(function (method) {
    app[method] = originals[method];
  });
};

