var methods = [
  'del',  'get', 'head', 'opts', 'post', 'put', 'patch'
];

function enprefixRegExp(prefix, arg) {
  var org = arg.toString();
  org = org.substr(1,org.length-2);
  var array = ["^",prefix.replace('/','\\/')];
  if (org[0] == '^') {
    array.push(org.substr(1));
  } else {
    array.push(".*");
    array.push(org);
  }
  var pattern = array.join('');        
  return new RegExp(pattern);
}

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
        args[0] = enprefixRegExp(prefix,arg);
      } else if (typeof arg === 'object') {
        if (typeof arg.path === 'string') {
          arg.path = prefix + arg.path;
        } else if (arg.path instanceof RegExp) {
          arg.path = enprefixRegExp(prefix,arg.path);
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

