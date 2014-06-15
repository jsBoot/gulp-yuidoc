# Fork notes
This fork adds support for passing in an options object. Options object contains "ignoreTags"
array which tells YUIDoc to ignore certain @ tags. Also requires forked version of YUIDoc
available at https://github.com/Netflix-Skunkworks/yuidoc.

This version also adds a yuidoc.success flag onto the stream for use in error reporting. This can be consumed by error reports later in the stream, e.g., commit hook.


# gulp-yuidoc
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url]  [![Coverage Status][coveralls-image]][coveralls-url] [![Dependency Status][depstat-image]][depstat-url] [![Code Climate][codeclimate-image]][codeclimate-url]

> [yuidoc](https://github.com/yui/yuidoc) plugin for [gulp](https://github.com/wearefractal/gulp)

WARNING
-------------

This is an early release, and you will likely encounter bugs or limitations.

TL;DR
-------------

Install `gulp-yuidoc` as a development dependency:

```shell
npm install --save-dev gulp-yuidoc
```

Then, add it to your `gulpfile.js`:

```javascript
var yuidoc = require("gulp-yuidoc");

gulp.src("./src/*.js")
  .pipe(yuidoc())
  .pipe(gulp.dest("./doc"));
```

## API

### yuidoc.parser(options, name)

Calling the parser alone will build a vinyl containing the parsing result of fed files.
By default, that vinyl will get named "yuidoc.json", unless you override it with the optional "name" argument.

"options" allows you to speficy yuidoc parsing options (XXX untested).

```javascript
gulp.src("./src/*.js")
  .pipe(yuidoc.parser())
  .pipe(gulp.dest("./jsondocoutput"));
```

### yuidoc.reporter()

Reports whatever went wrong with parsing.

```javascript
gulp.src("./src/*.js")
  .pipe(yuidoc.parser())
  .pipe(yuidoc.reporter())
```

If you prefer ugly things, call `yiudoc.yuiReporter()` instead (default reporter, which is beautiful, is "stylish", stolen from sindresorhus).

### yuidoc.generator(options)

Generates documentation from the result of the parser.

```javascript
gulp.src("./src/*.js")
  .pipe(yuidoc.parser())
  .pipe(yuidoc.generator())
  .pipe(gulp.dest('./documentation-output'))
```

You may pass yuidoc generator options optionally (XXX untested - undocumented).

### yuidoc(parseOpts, renderOpts)

This:

```javascript
gulp.src("./src/*.js")
  .pipe(yuidoc())
  .pipe(gulp.dest('./documentation-output'))
```

is a shortcut for:

```javascript
gulp.src("./src/*.js")
  .pipe(yuidoc.parser())
  .pipe(yuidoc.reporter())
  .pipe(yuidoc.generator())
  .pipe(gulp.dest('./documentation-output'))
```

## Configuration
To add project-level configuration, such as version and project name, add them to a
`project` key in the options given to the parser. Example:

```javascript
.pipe(yuidoc({
   project: {
    "name": "The Foo API",
    "description": "The Foo API: a library for doing X, Y, and Z",
    "version": "1.2.0",
    "url": "http://example.com/"
   }
 }))
```


## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)

[npm-url]: https://npmjs.org/package/gulp-yuidoc
[npm-image]: https://badge.fury.io/js/gulp-yuidoc.png

[travis-url]: http://travis-ci.org/jsBoot/gulp-yuidoc
[travis-image]: https://secure.travis-ci.org/jsBoot/gulp-yuidoc.png?branch=master

[coveralls-url]: https://coveralls.io/r/jsBoot/gulp-yuidoc
[coveralls-image]: https://coveralls.io/repos/jsBoot/gulp-yuidoc/badge.png?branch=master

[depstat-url]: https://david-dm.org/jsBoot/gulp-yuidoc
[depstat-image]: https://david-dm.org/jsBoot/gulp-yuidoc.png

[codeclimate-url]: https://codeclimate.com/github/jsBoot/gulp-yuidoc.js
[codeclimate-image]: https://codeclimate.com/github/jsBoot/gulp-yuidoc.png
