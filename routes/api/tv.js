/**
 * Engagement Lab Website
 * Developed by Engagement Lab, 2015-2018
 * ==============
 * TV model API controller.
 *
 * Help: https://gist.github.com/JedWatson/9741171
 *
 * @class tv
 * @author Johnny Richardson
 *
 * ==========
 */
var async = require('async'),
    keystone = require('keystone');

var TV = keystone.list('TV');

/**
 * Get all TV Content
 */
exports.get = function(req, res) {

    let tvQuery = TV.model.find({}, 'currentBlurb slideshowImages.secure_url');

    tvQuery.exec((err, result) => {

    	if (err) return res.apiError('database error', err);
		
			res.apiResponse(result);

    });
};
