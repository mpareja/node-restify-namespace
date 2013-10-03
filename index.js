var methods = [
  'del',  'get', 'head', 'opts', 'post', 'put', 'patch'
];

module.exports = function (app, prefix, callback) {
  var originals = {};
  methods.forEach(function (method) {
    var orig = originals[method] = app[method];
    app[method] = function () {
      if (typeof arguments[0] !== 'string') {
        throw new Error('Regular expression route support is not implemented');
      }
      arguments[0] = prefix + arguments[0];
      orig.apply(this, arguments);
    };
  });

  callback();

  methods.forEach(function (method) {
    app[method] = originals[method];
  });
};

