var express = require('express');
var router = express.Router();
var keystone = require('keystone');
var middleware = require('./middleware');
var importRoutes = keystone.importer(__dirname);

// Common Middleware
keystone.pre('routes', middleware.initErrorHandlers);
keystone.pre('routes', middleware.initLocals);
keystone.pre('render', middleware.flashMessages);

// Import Route Controllers
var routes = {
    api: importRoutes('./api'),
    views: importRoutes('./views')
};

// Setup Route Bindings

// Views

// CommunityPlanIt redirect (boston.communityplanit.org)
router.all('/climatesmartboston', function(req, res, next) {
    res.redirect('https://www.communityplanit.org/bostonclimate/');
});
router.all('/api/cpi/register', keystone.middleware.api, routes.api.communityplanit.create);

// /keystone redirect
router.all('/admin', function(req, res, next) {
    res.redirect('/keystone');
});

router.get('/', routes.views.index);

router.get('/unlockinghealth', routes.views.html.unlockinghealth);
router.get('/riskhorizon', routes.views.html.riskhorizon);

router.get('/about', routes.views.about);
router.get('/jobs', routes.views.jobs);
router.get('/people', routes.views.people);
router.get('/people/:person', routes.views.person);

router.get('/publications', routes.views.projects.publications);
router.get('/publications/:publication_key', routes.views.projects.publication);
router.get('/projects/:subdirectory/:project_key', routes.views.projects.project);

router.get('/cmap', routes.views.cmap);
router.get('/programs/cmap', routes.views.cmap);

router.get('/news', routes.views.news);
router.get('/press', routes.views.press);

router.all('/tamagagement', routes.views.tamagagement);

// NOTE: To protect a route so that only admins can see it, use the requireUser middleware:
// router.get('/protected', middleware.requireUser, routes.views.protected);

// Redirect projects to /all
router.get('/projects/', function(req, res, next) {
    res.redirect('/projects/all');
});

// Dynamic directory routes
router.get('/:directory', routes.views.directory);
router.get('/:directory/:subdirectory', routes.views.subdirectory);

module.exports = router;