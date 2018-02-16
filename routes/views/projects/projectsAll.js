/**
 * Engagement Lab Website
 * Developed by Engagement Lab, 2015
 * ==============
 * Research projects directory view controller.
 *
 * Help: http://keystonejs.com/docs/getting-started/#routesviews-firstview
 *
 * @module research
 * @class project
 * @static
 * @author Johnny Richardson
 *
 * ==========
 */
var keystone = require('keystone');
var Project = keystone.list('Project');
var Resource = keystone.list('Resource');
var _ = require('underscore');
var cloudinary = require('cloudinary');

exports = module.exports = function(req, res) {

    var view = new keystone.View(req, res),
        locals = res.locals;

    // Init locals
    locals.section_type = 'filter';
    locals.section = 'projects';

    // Load the current project
    view.on('init', function(next) {

        var projectFilter = { enabled: true };

        var queryProject = Project.model.find( projectFilter ).sort([
            ['sortOrder', 'ascending']
        ])
        .populate('person keyword format');

        queryProject.exec(function(err, resultProject) {

            var filters = [];
            for(var i = 0; i < resultProject.length; i++) {
                if (resultProject[i].format !== null && resultProject[i].format !== undefined){
                    _.each(resultProject[i].format, function(format) {
                        filters.push(format);
                    });
                }

                if (resultProject[i].keyword !== null && resultProject[i].keyword !== undefined){
                    _.each(resultProject[i].keyword, function(keyword) {
                        filters.push(keyword);
                    });
                }

                if (resultProject[i].person !== null && resultProject[i].person !== undefined) {
                    _.each(resultProject[i].person, function(person) {
                        filters.push(person);
                    });
                }
            };

            locals.filters = _.groupBy(filters, 'category');

            locals.filters =  _.map(locals.filters, function(group, filter) {
                                    group = _.uniq(group);
                                    var grouping = {};
                                    grouping[filter] = group;
                                    return grouping;
                                });

            _.map(resultProject, function(proj) {

                // Get image code
                proj.href = '/projects/' + ((proj.customUrl!==undefined && proj.customUrl.length>0) ? proj.customUrl : proj.key);
                proj.description = proj.description;

                return proj;

            });

            locals.listings = resultProject;
            next(err);
        });
    });

    // Render the view
    view.render('projects/projectsAll');

};