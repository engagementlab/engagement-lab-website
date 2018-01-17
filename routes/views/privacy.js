/**
 * Engagement Lab Website
 * Developed by Engagement Lab, 2017
 * ==============
 * Privacy Policy page view controller.
 *
 * Help: http://keystonejs.com/docs/getting-started/#routesviews-firstview
 *
 * @class privacy
 * @author Johnny Richardson
 *
 * ==========
 */
var keystone = require('keystone');

exports = module.exports = function(req, res) {

    var view = new keystone.View(req, res),
        locals = res.locals;

    // Init locals
    locals.section = 'privacy';

    // Render the view
    view.render('privacy');

};
