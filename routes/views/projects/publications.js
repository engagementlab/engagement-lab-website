/**
 * Engagement Lab Website
 * Developed by Engagement Lab, 2015
 * ==============
 * Research projects directory view controller.
 *
 * Help: http://keystonejs.com/docs/getting-started/#routesviews-firstview
 *
 * @module research
 * @class publications
 * @static
 * @author Johnny Richardson
 *
 * ==========
 */
var keystone = require('keystone');
var Publication = keystone.list('Publication');
var Subdirectory = keystone.list('Subdirectory');
var _ = require('underscore');

exports = module.exports = function(req, res) {

    var view = new keystone.View(req, res);
    var locals = res.locals;

    // locals.section is used to set the currently selected
    // item in the header navigation.
    locals.section = 'publications';

    // Load publications categories and sort them
    view.on('init', function(next) {

        var publications = Publication.model.find({}).sort('-date').populate('format person keyword');

        publications.exec(function(err, resultPubs) {

            // console.log(resultPubs)

            var filters = [];
            for(i = 0; i < resultPubs.length; i++) {
                if (resultPubs[i].format !== null && resultPubs[i].format !== undefined){
                    _.each(resultPubs[i].format, function(format) {
                        filters.push(format);
                    });
                }

                if (resultPubs[i].keyword !== null && resultPubs[i].keyword !== undefined){
                    _.each(resultPubs[i].keyword, function(keyword) {
                        filters.push(keyword);
                    });
                }

                if (resultPubs[i].person !== null && resultPubs[i].person !== undefined) {
                    _.each(resultPubs[i].person, function(person) {
                        filters.push(person);
                    });
                }
            };
            
            locals.publications = resultPubs;

            locals.filters =
            _
            .groupBy(filters, 'category');
            locals.filters = 
            _.map(locals.filters, function(group, filter) {
                console.log(group, filter);
                var grouping = {};
                grouping[filter] = group;
                console.log(grouping);
                return grouping;
            })
            .value();

            next(err);
        });
    });

    // Render the view
    view.render('projects/publications');

};