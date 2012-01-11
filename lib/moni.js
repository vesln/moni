/*!
 * moni - Process monitoring with node.
 * 
 * Veselin Todorov <hi@vesln.com>
 * MIT License.
 */
 
/**
 * Dependencies.
 */
var package = require('package')(module);
var Watcher = require('./watcher');

/**
 * Exposing `Watcher`.
 */
module.exports = Watcher;

/**
 * Exposing version.
 */
module.exports.version = package.version;