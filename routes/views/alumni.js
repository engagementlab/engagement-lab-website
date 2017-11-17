/**
 * Engagement Lab Website
 * Developed by Engagement Lab, 2015
 * ==============
 * CMAP page view controller.
 *
 * Help: http://keystonejs.com/docs/getting-started/#routesviews-firstview
 *
 * @class cmap
 * @static
 * @author Johnny Richardson
 *
 * ==========
 */
var keystone = require('keystone');
var Person = keystone.list('Person');
var Quote = keystone.list('Quote');
var _ = require('underscore');

exports = module.exports = function(req, res) {

    var view = new keystone.View(req, res),
        locals = res.locals;

    // Init locals
    locals.section = 'alumni';
    locals.section_type = 'filter';

    // CMAP query
    view.on('init', function(next) {

        var cmapQuery = Person.model.find({ category: 'CMAP' }, {}, {
            sort: { 'createdAt': -1 }
        })
        .populate('cohortYear keywords');

        cmapQuery.exec(function(err, result) {

            var filteredAlumni = _.filter(result, function(alumni) {
                if (!alumni.cohortYear.current)
                    return alumni;
            });

            var filters = [];
            for(var i = 0; i < filteredAlumni.length; i++) {
                if (filteredAlumni[i].cohortYear !== null && filteredAlumni[i].cohortYear !== undefined){
                    filters.push(filteredAlumni[i].cohortYear);
                }

                if (filteredAlumni[i].keywords !== null && filteredAlumni[i].keywords !== undefined){
                    _.each(filteredAlumni[i].keywords, function(keyword) {
                        filters.push(keyword);
                    });
                }

            };

            locals.filters = _.groupBy(_.uniq(filters), 'category');

            // locals.filters = _.uniq(locals.filters);

            locals.filters =  _.map(locals.filters, function(group, filter) {
                                    group = _.uniq(group);
                                    var grouping = {};
                                    grouping[filter] = group;
                                    return grouping;
                                });

            var alumni = {};

            _.each(filteredAlumni, function(alum) {
                if (alumni[alum.cohortYear.name])
                    alumni[alum.cohortYear.name].push(alum);
                else {
                    alumni[alum.cohortYear.name] = [];
                    alumni[alum.cohortYear.name].push(alum);
                }
            });

            // Get page elements
            locals.alumni = alumni;

            next(err);
            
        });

    });

    // Render the view
    view.render('alumni');

};
