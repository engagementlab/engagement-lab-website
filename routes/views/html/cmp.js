/**
 * Engagement Lab Website
 * Developed by Engagement Lab, 2016
 * ==============
 * 'Civic Media Project' search static view.
 *
 * @module html
 * @author Johnny Richardson
 *
 * ==========
 */
var path = require('path');

exports = module.exports = function(req, res) {

    // Render the view
    res.sendFile('templates/html/cmp.html', {root: path.join(__dirname, '../../../') });

};
