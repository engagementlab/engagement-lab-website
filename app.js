// Return server object
// Return server object
serverStart = function() {

	return require('express')();

};

// Any custom app initialization logic should go here
appStart = function(app) {
};

module.exports = function(frameworkDir, shared) {

	var keystoneInst = require('keystone');
	var tamabehavior = require('./tamabehavior');	

	// Added web sdk dependencies 
	require('app-module-path').addPath(frameworkDir + '/node_modules');

	// lolz
	keystoneInst.set('tamabehavior', tamabehavior);	

	return { 

		keystone: keystoneInst,
		server: serverStart,
		start: appStart	
	
	}
};