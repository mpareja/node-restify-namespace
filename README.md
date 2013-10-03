# restify-namespace - simple route namespacing

Defining sub-routes is something that happens often. Why keep repeating yourself? `restify-namespace` makes it easy to define nested route prefixes to DRY up your routes.

## Example

Here is how you might define some routes:

```javascript
var app = restify.createServer();
namespace(app, '/api', function () {
	app.get('/thingys', thingysHandler);

	namespace(app, '/beep', function () {
		app.get('/boop', plunkHandler);
	});
});
```

This would create the following routes:

    GET /api/thingys
	GET /api/beep/boop
