(function(){
  'use strict';

  var through2 = require('through2'),
    path = require('path'),
    gutil = require('gulp-util'),
    fs = require('vinyl-fs');

  var File = gutil.File;
  var PluginError = gutil.PluginError;

  var parser = require('./lib/parser.js');
  var builder = require('./lib/generator.js');

  /**
   * That's the plugin parser
   */

  var streamParser = function (name, options) {
    name = name || 'yuidoc.json';
    options = options || {};
    options.syntaxtype = options.syntaxtype || 'js';

    var filemap = {};
    var dirmap = {};
    var firstFile = null;

    var bufferFiles = function(file, enc, next){
      if (file.isNull()) return; // ignore
      if (file.isStream()) return this.emit('error', new PluginError('gulp-yuidoc',  'Streaming not supported'));

      // Store firstFile to get a base and cwd later on
      if (!firstFile) firstFile = file;

      // Build-up the filemap and dirmap to later feed the parser
      filemap[file.path] = file.contents.toString('utf8');
      dirmap[file.path] = file.cwd;

      next();
    };

    var endStream = function(conclude){
      // Nothing? Cut the chase!
      if (Object.keys(filemap).length === 0) return conclude();

      var data;
      try{
        data = JSON.stringify(parser(options, filemap, dirmap));
      }catch(e){
        return this.emit('error', new PluginError('gulp-yuidoc',
          'Oooooh! Failed parsing with yuidoc. What did you do?!' + e));
      }

      // console.warn(data);
      // Pump-up the generated json file
      this.push(new File({
        cwd: firstFile.cwd,
        base: firstFile.base,
        path: path.join(firstFile.base, name),
        contents: new Buffer(data)
      }));

      conclude();
    };

    // That's it for the parser
    return through2.obj(bufferFiles, endStream);
  };

  // May take any number of documentation json files as entry - this is kind of stupid, but well
  var streamBuilder = function(options){
    options = options || {};

    var processor = function(file, enc, next){
      if (file.isNull()) return; // ignore
      if (file.isStream()) return this.emit('error', new PluginError('gulp-yuidoc',  'Streaming not supported'));

      var json;
      try{
        json = JSON.parse(file.contents.toString('utf8'));
      }catch(e){
        return this.emit('error', new PluginError('gulp-yuidoc', 'Generator: invalid input documentation data!' + e));
      }

      // Globs the assets from the default theme
      var theme = path.join(__dirname, 'node_modules', 'yuidocjs', 'themes', 'default');
      var opt = {cwd: theme};
      var defaultheme = './assets/**/*';

      // Build from JSON
      builder(options, json, function(result){

        // Get the path/content pairs and spoof them into the stream
        Object.keys(result).forEach(function(f){
          var p = path.resolve(file.cwd, f);
          this.push(new File({
            cwd: file.cwd,
            base: file.cwd,
            path: p,
            contents: new Buffer(result[f])
          }));
        }.bind(this));

        // Get the theme and spoof it into us stream
        fs.src(defaultheme, opt)
          .pipe(through2.obj(function(f, e, n){
            // XXX why oh why - vinyl doesn't make much sense :-(
            f.base = f.cwd;
            this.push(f);
            n();
          }.bind(this), function(end){
            end();
            // XXX get the custom theme, possibly, otherwise, end the main stream as well.
            next();
          }));
      }.bind(this));

     //  var globber = new glob.Glob(path, opt);

     //  // globber.on('error', this.emit.bind(this, 'error'));

     //  // Push the shit inside
     //  globber.on('match', function(filename) {
     //    var p = path.resolve(opt.cwd, filename);
        // this.push(new File({
      //     cwd: opt.cwd,
      //     base: opt.cwd,
      //     path: p
      //   }));
     //  }.bind(this));

     //  // Done - XXX handle the optional custom theme dir
     //  globber.on('end', function(){
     //    console.warn("ending");
      //   next();
     //  }.bind(this));
    };

    return through2.obj(processor);
  };

  // Wrap reporter helper
  var wrapReporter = function(reporter){
    return function(options){
      return through2.obj(function(file, enc, next){
        var warnings = JSON.parse(file.contents.toString('utf8')).warnings;
        if(warnings && warnings.length){
          // Don't trust the (yahoo) reporter too much
          try{
            reporter(warnings, options);
          }catch(e){
            return this.emit('error', new PluginError('gulp-yuidoc', 'Reporter crashed!' + e));
          }
        }
        this.push(file);
        next();
      });
    };
  };

  var yuidoc = {};

  // Yui default, provided reporter
  yuidoc.yuiReporter = wrapReporter(require('./lib/uglyreporter'));

  // Our own reporter
  yuidoc.chalkReporter = wrapReporter(require('./lib/chalkreporter'));

  // Default to chalk, nicier :)
  yuidoc.reporter = yuidoc.chalkReporter;

  yuidoc.generator = streamBuilder;

  yuidoc.parser = streamParser;

  yuidoc.runner = function(options){
    return gutil.combine(
      yuidoc.parser(null, options),
      yuidoc.reporter(options),
      yuidoc.generator(options)
    )();
  };

  // Listening on uncaughtException is plain bad - deny YUI the right to do so
  // https://github.com/joyent/node/issues/2582
  process.removeAllListeners('uncaughtException');

  module.exports = yuidoc;

}());

