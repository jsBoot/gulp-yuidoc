# gulp-yuidoc
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url]  [![Coverage Status](coveralls-image)](coveralls-url) [![Dependency Status][depstat-image]][depstat-url]

> yuidoc plugin for [gulp](https://github.com/wearefractal/gulp)

## WARNING

Early release, likely buggy, use caution.

## Usage

First, install `gulp-yuidoc` as a development dependency:

```shell
npm install --save-dev gulp-yuidoc
```

Then, add it to your `gulpfile.js`:

```javascript
var yuidoc = require("gulp-yuidoc");

gulp.src("./src/*.hs")
  .pipe(yuidoc.runner())
  .pipe(gulp.dest("./doc"));
```

## API

### yuidoc(options)

#### options.bla
Type: `String`  
Default: ``

The bla to embed into your docs.


## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)

[npm-url]: https://npmjs.org/package/gulp-yuidoc
[npm-image]: https://badge.fury.io/js/gulp-yuidoc.png

[travis-url]: http://travis-ci.org/jsBoot/gulp-yuidoc
[travis-image]: https://secure.travis-ci.org/jsBoot/gulp-yuidoc.png?branch=master

[coveralls-url]: https://coveralls.io/r/jsBoot/gulp-yuidoc
[coveralls-image]: https://coveralls.io/repos/jsBoot/gulp-yuidoc/badge.png

[depstat-url]: https://david-dm.org/jsBoot/gulp-yuidoc
[depstat-image]: https://david-dm.org/jsBoot/gulp-yuidoc.png
