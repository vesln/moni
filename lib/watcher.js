/*!
 * moni - Process monitoring with node.
 *
 * Veselin Todorov <hi@vesln.com>
 * MIT License.
 */

/**
 * Dependencies.
 */
var EventEmitter = require('events').EventEmitter;
var exec = require('child_process').exec;
var util = require('util');

/**
 * toString alias.
 *
 * @type {Function}
 */
var toString = Object.prototype.toString;

/**
 * Watcher constructor.
 *
 * @param {String|Number|Array} pid or process name.
 */
function Watcher(pids) {
  this._processes = {};
  this.pids(pids);
};

// Watcher inherits from EventEmitter.
util.inherits(Watcher, EventEmitter);

/**
 * Parses pids.
 *
 * @param {String|Number} pid or process name.
 * @param {Function} callback.
 * @api public
 */
Watcher.prototype.parse = function(pids, cb) {
  var self = this;

  if (toString.call(pids) === '[object Number]') {
    return cb.call(this, pids);
  }

  this.pidof(pids, function(pid) {
    cb.call(self, pid);
  });
};

/**
 * Pids accessor.
 *
 * @param {Array} pids
 * @returns {Mixed}
 */
Watcher.prototype.pids = function(pids) {
  if (arguments.length === 1) {
    if (!Array.isArray(pids)) pids = [pids];
    this._pids = pids;
  }
  return this._pids;
};

/**
 * Interval accessor.
 *
 * @param {Array} pids
 * @returns {Mixed}
 * @api public
 */
Watcher.prototype.interval = function(interval) {
  if (arguments.length === 1) this._interval = interval;
  return this._interval;
};

/**
 * Find pidof process.
 *
 * @param {String} process
 * @param {Function} cb
 */
Watcher.prototype.pidof = function(str, cb) {
  var pids = null;
  var pid = null;

  exec('pidof ' + str, function (error, stdout, stderr) {
    pids = stdout.split(/\s+/);
    pids.forEach(function(pid, i) {
      if (!pid) pids.splice(i, 1);
    });
    if (pids[0]) pid = pids[0];
    cb(pid);
  });
};

/**
 * Starts to monitor processes.
 *
 * @param {Number} interval.
 */
Watcher.prototype.watch = function(interval) {
  var self = this;
  this.interval(interval);

  this.pids().forEach(function(pid) {
    self.check(pid, function(live) {
      self._processes[pid] = live;
      self.start(pid, interval);
    });
  });
};

/**
 * Initializes the continious monitoring.
 *
 * @param {Number} pid
 * @param {Number} interval
 */
Watcher.prototype.start = function(pid, interval) {
  var self = this;

  setInterval(function() {
    self.check(pid, function(live) {
      if (live !== self._processes[pid]) {
        self._processes[pid] = live;
        self.notify(pid, live);
      }
    });
  }, interval);
};

/**
 * Emits a start/end event.
 *
 * @param {Number} pid
 * @param {Boolean} state
 */
Watcher.prototype.notify = function(pid, state) {
  var name = (state) ? 'start' : 'end';
  this.emit(name, pid);
};

/**
 * Checks if process is live.
 *
 * @param {Number} pid
 * @param {Function} cb
 */
Watcher.prototype.check = function(pid, cb) {
  this.parse(pid, function(p) {
    var result = false;

    try {
      if (p && !process.kill(p, 0)) result = true;
    } catch (err) {
      result = false;
    }

    cb(result);
  });
};

/**
 * Exposing `Watcher`.
 */
module.exports = Watcher;
