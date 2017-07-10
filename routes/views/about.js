/**
 * Engagement Lab Website
 * Developed by Engagement Lab, 2015
 * ==============
 * About page view controller.
 *
 * Help: http://keystonejs.com/docs/getting-started/#routesviews-firstview
 *
 * @class about
 * @author Johnny Richardson
 *
 * ==========
 */
var keystone = require('keystone');
var About = keystone.list('About');
var Partner = keystone.list('Partner');
var _ = require('underscore');
var Resource = keystone.list('Resource');

exports = module.exports = function(req, res) {

    var view = new keystone.View(req, res),
        locals = res.locals;

    // Init locals
    locals.section = 'about';

    view.on('init', function(next) {

        var queryAbout = About.model.findOne({}, {}, {
            sort: {
                'createdAt': -1
            }
        });

        queryAbout.exec(function(err, resultAbout) {

            locals.about = resultAbout;
            locals.about.historyImages1 = [];
            locals.about.historyImages2 = [];
            for (var i = 0; i < resultAbout.historyImages.length; i++) {
                if (i > 5) {
                    break;
                } else if (i < 3) {
                    locals.about.historyImages1.push(resultAbout.historyImages[i]);
                } else {
                    locals.about.historyImages2.push(resultAbout.historyImages[i]);
                }
            }

            var queryPartners = Partner.model.find({}).sort([
                ['sortOrder', 'ascending']
            ]);

            queryPartners.exec(function(err, resultPartners) {
                locals.partners = resultPartners;
                
                // Show the 3 most recently added articles
                Resource.model.find({ type: 'article' }, {}, {
                    sort: { date: -1 }
                }).limit(3).exec(function(err, articleResult){
                    if (err) throw err;
                    locals.articles = articleResult;
                    next(err);
                });
            });
        });
    });

    // Render the view
    view.render('about');

};
