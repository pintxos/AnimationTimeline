var config = {
	testDependencies: [
		'bower_components/pintxos-inherit/index.js',
		'bower_components/eventEmitter/EventEmitter.js',
		'bower_components/jquery/dist/jquery.js',
		'tests/*.js',
		'index.js'
	]
};

module.exports = require('grunt-pintxos')(config);
