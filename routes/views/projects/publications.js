'use strict';
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

        var categorize = function(val, opt) {
            return val.filter(function(item) {
                return opt.indexOf(item.form.key) >= 0;
            });
        };

        var pubQuery = Publication.model.find({}).sort('-date').populate('form person keyword');

        pubQuery.exec(function(err, resultPubs) {

            var publications = resultPubs;

            var filters = [];
            for(var i = 0; i < publications.length; i++) {
                if (publications[i].form !== null && publications[i].form !== undefined){
                    filters.push(publications[i].form);
                }

                if (publications[i].keyword !== null && publications[i].keyword !== undefined){
                    _.each(publications[i].keyword, function(keyword) {
                        filters.push(keyword);
                    });
                }

                if (publications[i].person !== null && publications[i].person !== undefined) {
                    _.each(publications[i].person, function(person) {
                        filters.push(person);
                    });
                }
            };
            
            var books = categorize(publications, ['book']);
            var guides = categorize(publications, ['guide']);
            var articles = categorize(publications, ['article', 'chapter']);

            locals.publications = {};
            locals.publications['Books'] = books;
            locals.publications['Guides'] = guides;
            locals.publications['Articles and Chapters'] = articles;

            locals.filters = _.groupBy(filters, 'category');

            locals.filters =  _.map(locals.filters, function(group, filter) {
                                    group = _.uniq(group);
                                    var grouping = {};
                                    grouping[filter] = group;
                                    return grouping;
                                });

            next(err);
        });
    });

    // Render the view
    view.render('projects/publications');

};