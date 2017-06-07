/**
 * Engagement Lab Website
 * Developed by Engagement Lab, 2015
 * ==============
 * Home page view controller.
 *
 * Help: http://keystonejs.com/docs/getting-started/#routesviews-firstview
 *
 * @class index
 * @static
 * @author Johnny Richardson
 *
 * ==========
 */
var keystone = require('keystone');
var Project = keystone.list('Project');
var NewsBox = keystone.list('NewsBox');
var Resource = keystone.list('Resource');
// var Syllabi = keystone.list('Syllabi');
var _ = require('underscore');

// News data propagated by ./jobs/news
var store = require('json-fs-store')('./tmp');

exports = module.exports = function(req, res) {

    var view = new keystone.View(req, res);
    var locals = res.locals;

    // locals.section is used to set the currently selected
    // item in the header navigation.
    locals.section = 'home';

    // Make any queries
    // ELab homepage
    view.on('init', function(next) {

        locals.featured_content = [];

        // This query gets all featured projects
        var projectQuery = Project.model.find({
            'enabled': true,
            'featured': true
        })
        .populate('subdirectory');

        // Setup the locals to be used inside view
        projectQuery.exec(function(err, result) {
            if (err) throw err;
            locals.featured_projects = result;

            NewsBox.model.find({}).exec(function(err, result) {
                locals.featured_content = result;
                
                // locals.news = newsData.news;
                // _.each(locals.news, function(post){
                //     post.content = post.content.replace(/(^(By)\s+(.*)?[0-9]\s)/, '');
                // });

                // locals.featured = newsData.news.shift();
                // locals.events = newsData.events;

                // Show the 3 most recently added articles
                Resource.model.find({ type: 'article' }, {}, {
                    sort: { date: -1 }
                }).limit(3).exec(function(err, articleResult){
                    if (err) throw err;
                    locals.articles = articleResult;
                });

                locals.twitter = {};

                twitter.get('statuses/user_timeline.json?count=3', function(err, tweets, response) {
                    
                    if (err) throw error;

                    locals.twitter.user = tweets[0].user.screen_name;
                    locals.twitter.tweets = [];

                    for (var i = 0; i < tweets.length; i++) {
                        
                        var tweet = tweets[i];
                        var html = tweet.text;
                        var entities = _.union(
                            tweet.entities.hashtags, 
                            tweet.entities.user_mentions, 
                            tweet.entities.urls);

                        entities = _.sortBy(entities, function(n) { return n.indices[0]; }).reverse();

                        for (var j = 0; j < entities.length; j++) {
                            var e = entities[j];
                            html = html.splice(e.indices[1], 0, "</a>");
                            if (e.text) {
                                // hashtag
                                html = html.splice(e.indices[0], 0, "<a href='https://twitter.com/hashtag/" + e.text + "/'>");
                            } else if (e.url) {
                                // link
                                html = html.splice(e.indices[0], 0, "<a href='" + e.url + "'>")
                            } else if (e.screen_name) {
                                // mention
                                html = html.splice(e.indices[0], 0, "<a href='https://twitter.com/" + e.screen_name + "/'>")
                            }
                        };
                        locals.twitter.tweets.push({ text: html });
                    }
                    next(err);
                });
            });
        });

    });


    // Render the view
    view.render('index');

};
