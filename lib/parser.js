/**
 * This is the document parser
 * Should be fed an options object, a list of files and dirs
 */

(function(){
  'use strict';

  var Y = require('yuidocjs');

  var parser = function(options, filemap, dirmap){
    // Be sure NOT to write the resulting JSON file to disk
    options.writeJSON = false;
    // Shut it
    options.lint = false;
    // Shut it, really
    options.quiet = true;

    // Init yui
    var ydoc = new Y.YUIDoc(options);

    // Return the generated json
    return ydoc.writeJSON(new Y.DocParser({
      syntaxtype: ydoc.options.syntaxtype,
      filemap: filemap,
      dirmap: dirmap
    }).parse());
  };

  module.exports = parser;

}());
