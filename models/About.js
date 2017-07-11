/**
 * Engagement Lab Website
 * 
 * About page Model
 * @module about
 * @class about
 * @author Johnny Richardson
 * 
 * For field docs: http://keystonejs.com/docs/database/
 *
 * ==========
 */

var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * about model
 * @constructor
 * See: http://keystonejs.com/docs/database/#lists-options
 */
var About = new keystone.List('About', 
	{
		label: 'About Page',
		singular: 'About Page',
		// nodelete: true,
		nocreate: true
	});

/**
 * Model Fields
 * @main About
 */
About.add({
	name: { type: String, default: "About Page", hidden: true, required: true, initial: true },
	aboutUs: { type: Types.Markdown, label: "About Us Section", required: true, note: 'This will appear directly below the About page video.' },
	ourWork: { type: Types.Markdown, label: "Our Work Section", required: true, note: 'This will appear directly below the mission statement.' },

	history1: { type: Types.Textarea, label: "History Paragraph 1", required: true, note: 'First (required) paragraph -- The FIRST 3 History images will appear below this text'},
	history2: { type: Types.Textarea, label: "History Paragraph 2", required: true, note: 'Second (required) paragraph -- The LAST 3 History images will appear below this text' },
	history3: { type: Types.Textarea, label: "History Paragraph 3", required: true, note: 'Third (required) paragraph' },
	history4: { type: Types.Textarea, label: "History Paragraph 4", required: false, note: 'Last (optional) paragraph' },
	historyImages: {
		type: Types.CloudinaryImages,
		label: 'History Images (Requires EXACTLY 6 images to display properly)',
		folder: 'site/about',
		autoCleanup: true
	},
	
	collaborate: { type: Types.Textarea, label: "Collaborate With Us", required: true, note: 'The \'Collaborate With Us\' section begins with this text' },
	studentsResearchers: { type: Types.Textarea, label: "Students and Researchers", required: true, note: 'First collaboration section text' },
	// clientsConsulting: { type: Types.Textarea, label: "Clients and Consulting", required: true, note: 'Currently not appearing'},
	partnerships: { type: Types.Textarea, label: "Community Based Partnerships", required: true, note: 'Second collaboration section text' }
	
});

/**
 * Model Registration
 */
About.defaultSort = '-createdAt';
About.defaultColumns = 'name, updatedAt';
About.register();
