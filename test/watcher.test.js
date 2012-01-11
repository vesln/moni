/*!
 * moni - Process monitoring with node.
 * 
 * Veselin Todorov <hi@vesln.com>
 * MIT License.
 */
 
/**
 * Dependencies.
 */
var Watcher = require('../lib/watcher');
var spawn = require('child_process').spawn;
var exec = require('child_process').exec;

describe('Watcher', function() {
  describe('constructor', function() {
    it('should trigger the supplied cb', function() {
      var watcher = new Watcher(3333);
      watcher.pids().should.eql([3333]);
    });
  });
  
  describe('parse', function() {
    it('should convert number to array', function(done) {
      var watcher = new Watcher;
      watcher.parse(3333, function(pids) {
        pids.should.eql([3333]);
        done();
      })
    });
    
    it('should convert keep the array', function(done) {
      var watcher = new Watcher;
      watcher.parse([3333], function(pids) {
        pids.should.eql([3333]);
        done();
      })
    });
    
    it('should convert string to number', function(done) {
      var watcher = new Watcher;
      watcher.parse('node', function(pids) {
        pids.should.be.ok;
        done();
      })
    });
  });
  
  describe('pids', function() {
    it('should be accessor', function() {
      var watcher = new Watcher;
      watcher.pids(3333).should.eql([3333]);
    });
  });
  
  describe('interval', function() {
    it('should be accessor', function() {
      var watcher = new Watcher;
      watcher.interval(3333).should.eql(3333);
    });
  });
  
  describe('pidof', function() {
    it('should return pidof process', function(done) {
      var watcher = new Watcher;
      watcher.pidof('node', function(pid) {
        pid.should.be.ok;
        done();
      });
    });
  });
  
  describe('notify', function() {
    it('should emit events', function(done) {
      var watcher = new Watcher;
      watcher.pids(3333);
      watcher.on('end', function(pid) {
        pid.should.eql(3333);
        done();
      });
      watcher.notify(3333, false);
    });
    
    it('should emit events', function(done) {
      var watcher = new Watcher;
      watcher.pids(3333);
      watcher.on('start', function(pid) {
        pid.should.eql(3333);
        done();
      });
      watcher.notify(3333, true);
    });
  });
  
  describe('check', function() {
    it('should check if process is live', function(done) {
      var watcher = new Watcher;
      watcher.check(process.pid, function(live) {
        live.should.be.ok;
        done();
      });
    });
    
    it('should check if process is live or not', function(done) {
      var watcher = new Watcher;
      watcher.check(312321321, function(live) {
        live.should.not.ok;
        done();
      });
    });
  });
  
  describe('watch, start', function() {
    it('should notify if process is dead', function(done) {
      var child = spawn('node', [__dirname + '/support/spawn']);
      var watcher = new Watcher(child.pid);
      watcher.on('end', function() {
        done();
      });
      watcher.watch(5);
      setTimeout(function() {
        child.kill();
      }, 20);
    });
  });
});