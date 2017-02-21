/**
 * Engagement Lab Website
 * Developed by Engagement Lab, 2016
 * ==============
 * Project bio view controller.
 *
 * Help: http://keystonejs.com/docs/getting-started/#routesviews-firstview
 *
 * @class team
 * @author Johnny Richardson
 *
 * ==========
 */
var keystone = require('keystone');
var Project = keystone.list('Project');
var _ = require('underscore');

exports = module.exports = function(req, res) {

    var view = new keystone.View(req, res),
        locals = res.locals;

    // Init locals
    locals.section = 'project-slider';
    locals.filters = {
        _key: req.params.project
    };

    // Load all team members and sort/categorize them 
    view.on('init', function(next) {

        var q = Project.model.find({}).sort([
            ['sortOrder', 'ascending']
        ])
        .populate('videos articles blogs files subdirectory');

        // Get all people but also get index of the selected person
        q.exec(function(err, result) {

            var thisProject = _.find(result, function(thisProject) { 
                                 return thisProject.key === locals.filters._key; 
                             });
            var projectInd = _.indexOf(result, thisProject);

            locals.projects = result;
            locals.starting_index = projectInd;

            next(err);

        });

    });

    // Render the view
    view.render('projectslider');

};
