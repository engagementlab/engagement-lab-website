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

            console.log(resultPubs)

            var filters = [];
            for(i = 0; i < resultPubs.length; i ++) {
                console.log(resultPubs[i])
                if (resultPubs[i].format !== null && resultPubs[i].format !== undefined)
                    filters.push(resultPubs[i].format);

                if (resultPubs[i].keyword !== null && resultPubs[i].keyword !== undefined)
                    filters.push(resultPubs[i].keyword);

                if (resultPubs[i].person !== null && resultPubs[i].person !== undefined)
                    filters.push(resultPubs[i].person);
            };
            
            locals.publications = resultPubs;

            locals.filters =
                _
                .chain(filters)
                .groupBy('category')
                .map(function(group, name) {
                    return {
                        key: name.toLowerCase().replace(' ', '-'),
                        label: name,
                        values: filter
                                .map(function(category, catKey) { 
                                    var key = category.key;
                                    var name = category.name; 
                                    return { "key": key,  "name": name }; 
                                })
                    };
                })
                .value();

            next(err);
        });
    });

    // Render the view
    view.render('projects/publications');

};