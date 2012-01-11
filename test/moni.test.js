/*!
 * moni - Process monitoring with node.
 * 
 * Veselin Todorov <hi@vesln.com>
 * MIT License.
 */
 
/**
 * Dependencies.
 */
var moni = require('../');
var exec = require('child_process').exec;
var Watcher = require('../lib/watcher');

describe('moni', function() {
  it('should expose Watcher', function() {
    moni.should.eql(Watcher);
  });
  
  it('should expose version', function() {
    moni.version.should.be.ok;
  });
});