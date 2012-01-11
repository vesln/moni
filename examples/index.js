/*!
 * moni - Process monitoring with node.
 * 
 * Veselin Todorov <hi@vesln.com>
 * MIT License.
 */
var Watcher = require('../');
var watcher = new Watcher('redis-server');

watcher.on('start', function() {
  console.log('redis is up.');
});

watcher.on('end', function() {
  console.log('redis is down.');
});

watcher.watch(100);