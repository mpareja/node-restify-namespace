var test = require('tape');
var restify = require('restify');
var request = require('supertest');
var namespace = require('..');

test('can create a top-level namespace', function (t) {
  var app = restify.createServer();
  t.on('end', function () { app.close(); });
  t.plan(1);

  namespace(app, '/beep', function () {
    app.get('/boop', function (req, res, next) {
      res.json(200, {data: 'boop'});
      next();
    });
  });

  request(app)
    .get('/beep/boop')
    .expect(200, {data: 'boop'})
    .end(function (err) { t.error(err); });
});

test('can create multiple levels', function (t) {
  var app = restify.createServer();
  t.on('end', function () { app.close(); });
  t.plan(1);

  namespace(app, '/beep', function () {
    namespace(app, '/boop', function () {
      app.get('/plunk', function (req, res, next) {
        res.json(200, {data: 'plunk'});
        next();
      });
    });
  });

  request(app)
    .get('/beep/boop/plunk')
    .expect(200, {data: 'plunk'})
    .end(function (err) { t.error(err); });
});

test('can continue adding to top-level after namespace', function (t) {
  var app = restify.createServer();
  t.on('end', function () { app.close(); });
  t.plan(1);

  namespace(app, '/beep', function () { });

  app.get('/crunch', function (req, res, next) {
    res.json(200, {data: 'crunch'});
    next();
  });

  request(app)
    .get('/crunch')
    .expect(200, {data: 'crunch'})
    .end(function (err) { t.error(err); });
});

test('can register name space using options object', function (t) {
  var app = restify.createServer();
  t.on('end', function () { app.close(); });
  t.plan(1);

  namespace(app, '/beep', function () {
    app.get({ path: '/boop' }, function (req, res, next) {
      res.json(200, {data: 'boop'});
      next();
    });
  });

  request(app)
    .get('/beep/boop')
    .expect(200, {data: 'boop'})
    .end(function (err) { t.error(err); });
});

test('throws on regex routes', function (t) {
  var app = restify.createServer();
  t.plan(2);

  namespace(app, '/beep', function () {
    t.throws(function () {
      app.get(/\/boop/, function (req, res, next) {
        res.json(200, {data: 'boop'});
        next();
      });
    }, /not implemented/);

    t.throws(function () {
      app.get({ path: /\/boop/ }, function (req, res, next) {
        res.json(200, {data: 'boop'});
        next();
      });
    }, /not implemented/);
  });
});
