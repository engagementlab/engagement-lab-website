/**
 * Engagement Lab Website
 * 
 * CMAP page Model
 * @module cmap
 * @class cmap
 * @author Jay Vachon
 * 
 * For field docs: http://keystonejs.com/docs/database/
 *
 * ==========
 */

var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * @module cmap
 * @constructor
 * See: http://keystonejs.com/docs/database/#lists-options
 */
var Cmap = new keystone.List('Cmap', 
	{
		label: 'CMAP Page',
		singular: 'CMAP Page',
		nodelete: true,
		nocreate: true
	});

/**
 * Model Fields
 * @main cmap
 */
Cmap.add({
		name: { type: String, default: "CMAP Page", hidden: true, required: true },
		
		logo: { type: Types.CloudinaryImage, label: "CMAP logo", folder: "site/cmap", autoCleanup: true, note: 'This image appears at the top left next to the header text' },

		videoLink: { type: String, label: 'Video Embed Link', note: 'Should be in format "//player.vimeo.com/video/..." skipping the "http:"'}, 
		
		programDescription: { type: Types.Markdown, label: "Lead", note: 'This is the header text. Follows \'The MA in Civic Media, Art & Practice\'...'},
		apply1: { type: Types.Markdown, label: "Is CMAP the right program for you? (First Text)", note: 'This is the first paragraph(s) in the apply section' },
		apply2: { type: Types.Markdown, label: "Is CMAP the right program for you? (Second Text)", note: 'This is the second paragraph(s) in the apply section'},
		
		curriculum: { type: String, label: "Curriculum", note: 'This is the text in the \'Curriculum\' section' },
		structure: { type: Types.Markdown, label: "The Structure", note: 'This is the text in the \'The Structure\' section'  },
		courses: { type: Types.Markdown, label: "Core Courses", note: 'This is the text in the \'Core Courses\' section' },
		alumni: { type: Types.Markdown, label: "Alumni", note: "This is the text in the \'Alumni\' section" }
	},
	
	'Core Elements of the CMAP Experience', {
		headers: { type: Types.TextArray, label: "Element Heading", note: "There should be FOUR headers, one for each core element of the CMAP experience" },
		subheaders: { type: Types.TextArray, label: "Element Subheaders", note: "Each header should have a subheader, so there should be FOUR" },
		elements: { type: Types.TextArray, label: "Element descriptions", note: "Each core element has a description (and a unique color), so there should be FOUR" }
	});

/**
 * Hooks
 * =============
 */
Cmap.schema.pre('save', function(next) {
	// TODO: Implement as global md sanitizer
	this.programDescription.html = this.programDescription.html.replace(/<p[^>]+?>|<p>|<\/p>/g, '');

	next();
});

/**
 * Model Registration
 */
Cmap.register();
