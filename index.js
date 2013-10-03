var methods = [
  'del',  'get', 'head', 'opts', 'post', 'put', 'patch'
];

module.exports = function (app, prefix, callback) {
  var originals = {};
  methods.forEach(function (method) {
    var orig = originals[method] = app[method];
    app[method] = function () {
      var args = Array.prototype.slice.call(arguments, 0);
      if (typeof args[0] !== 'string') {
        throw new Error('Regular expression route support is not implemented');
      }
      args[0] = prefix + args[0];
      orig.apply(this, args);
    };
  });

  callback();

  methods.forEach(function (method) {
    app[method] = originals[method];
  });
};

