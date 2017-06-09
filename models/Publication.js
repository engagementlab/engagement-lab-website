/**
 * Engagement Lab Website
 * 
 * Publication page Model
 * @module publication
 * @author Johnny Richardson
 * 
 * For field docs: http://keystonejs.com/docs/database/
 *
 * ==========
 */

var keystone = require('keystone');
var Types = keystone.Field.Types;
var slack = keystone.get('slack');

/**
 * @module publication
 * @constructor
 * See: http://keystonejs.com/docs/database/#lists-options
 */
var Publication = new keystone.List('Publication', 
	{
		sortable: true,
		track: true,
		map: { name: 'title' },
		autokey: { path: 'key', from: 'title', unique: true }
	});

/** 
	* Caching fields for 'post' save hook
	*/
var docIsNew;
var docIsModified;

/**
 * Model Fields
 * @main Publication
 */
Publication.add({
	title: { type: String, label: 'Title', required: true, initial: true, index: true, note: 'This is the link text for article/chapter urls, and the link text to individual pages for books and guides.' }
}, 'Filters', {
  keyword: {
      type: Types.Relationship,
      filters: {
          category: 'Keyword', 
          appears: 'Publication'
      },
      ref: 'Filter',
      label: 'Keyword(s)',
      note: 'What is this publication about? Pick from here or add a new Keyword Filter and choose \'Publication\' for the destination.',
      required: true,
      many: true,
      initial: true
  },
  person: {
      type: Types.Relationship,
      filters: {
          category: 'Person'
      },
      ref: 'Filter',
      label: 'Author(s)',
      note: 'Who wrote this publication? Pick from here or add a new Person Filter.',
      required: true,
      many: true,
      initial: true
  },
  format: {
      type: Types.Relationship,
      filters: {
          category: 'Format',
          appears: 'Publication'
      },
      ref: 'Filter',
      label: 'Format(s)',
      note: 'What kind of publication is this? A book? An article? Pick from here or add a new Format Filter and choose \'Publication\' for the destination.',
      required: true,
      many: true,
      initial: true
  }
}, 'Publication Information', {
  author: { type: String, label: 'Author Name(s)', required: true, initial: true, note: 'This appears below the title.' },
	// This field is required in the save hook below instead of here as keystone dependsOn workaround
	blurb: { type: Types.Textarea, label: 'Blurb Text', 
		dependsOn: { category: 'Articles and Chapters' }, note: 'This displays beneath the title, date, and author in the article or chapter listing.' },

	description: { type: Types.Markdown, label: 'Description Text',
		dependsOn: { category: ['Book', 'Guide'] }, required: false, initial: true, note: 'This displays on the individual publication page under \'About\''},

	image: { type: Types.CloudinaryImage, label: 'Thumbnail',
		dependsOn: { category: ['Book', 'Guide'] }, folder: 'research/publications', autoCleanup: true, note: 'This is the image thumbnail that displays on the publication listings page.' },

	bannerImage: { type: Types.CloudinaryImage, label: 'Banner Image',
		dependsOn: { category: ['Book', 'Guide'] }, folder: 'research/publications', autoCleanup: true, note: 'This is the banner image on the individual publication page, displayed behind the title. If none is uploaded, the title will display with a dark-grey background by default.' },

	date: { type: Date, label: 'Publication Date', initial: true, required: true, note: 'For Books/Guides, this displays on the individual page below the author. For Articles and Chapters, this displays in the listing next to the author.' },

	articleUrl: { type: String, label: 'Article URL', initial: true, note: 'This is the url link to the article or chapter on the publications listing page.' },
	purchaseUrls: {
		type: Types.TextArray,
		label: 'Links to purchase book',
		note: 'Must be in format "http://www.something.org"'
		// dependsOn: { category: ['Book', 'Guide'] }
	},
	downloadUrls: {
		type: Types.TextArray,
		label: 'Link(s) to download book',
		note: 'Must be in format "http://www.something.org"'
		// dependsOn: { category: ['Book', 'Guide'] }
	},
	file: {
		type: Types.AzureFile,
		label: 'File',
		note: 'If uploaded, a downloadable link to the book or guide will be appear on the publication\'s individual page.',
		// dependsOn: { category: ['Book', 'Guide'] }
		filenameFormatter: function(item, filename) {
			return item.key + require('path').extname(filename);
		},
		containerFormatter: function(item, filename) {
			return 'elabpublication';
		}
	},

	createdAt: { type: Date, default: Date.now, noedit: true, hidden: true }
});

/**
 * Hooks
 * =============
 */
Publication.schema.pre('save', function(next) {
  
  // Save state for post hook
  this.wasNew = this.isNew;
  this.wasModified = this.isModified();

  next();

});

Publication.schema.post('save', function(next) {

  var publication = this;

  // Make a post to slack when this Publication is updated    
  slack.Post(
  	Publication.model, this, true, 
  	function() { return publication.title; }
  );


});

/**
 * Model Registration
 */
Publication.defaultSort = '-createdAt';
Publication.defaultColumns = 'title, category';
Publication.register();
