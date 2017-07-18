/**
 * Engagement Lab Website
 * 
 * Person page parent Model
 * @module team
 * @author Johnny Richardson
 * 
 * For field docs: http://keystonejs.com/docs/database/
 *
 * ==========
 */

var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * @module team
 * @constructor
 * See: http://keystonejs.com/docs/database/#lists-options
 */
var Person = new keystone.List('Person', 
	{
		label: 'People',
		singular: 'Team Member',
		sortable: true,
		autokey: { path: 'key', from: 'name', unique: true }
	});

/**
 * Model Fields
 * @main Person
 */
Person.add({

	name: { type: Types.Name, label: 'Name', required: true, initial: true, index: true },
  category: { type: Types.Select, options: 'faculty leadership, advisory board, staff, faculty fellows, CMAP, lab assistants', default: 'team', required: true, initial: true, note: 'This determines the section in which the person displays' },

	title: { type: String, label: 'Title',
		dependsOn: { category: ['faculty leadership', 'staff', 'faculty fellows', 'lab assistants'] }, initial: true, note: 'This appears below the name.' },
	cohortYear: { 
		type: Types.Relationship, 
		label: 'Year(s)',
		dependsOn: { category: ['CMAP', 'advisory board'] },
		ref: 'Filter',
		filters: {
      category: 'Cohort'
    }, 
    initial: true, 
    required: true,
    note: 'This field is for students and board members, and will display below the title.'
  },
  keywords: { 
		type: Types.Relationship, 
		label: 'Keywords and Other Filters',
		dependsOn: { category: 'CMAP' },
		ref: 'Filter',
		filters: {
      category: 'Keyword'
    }, 
    many: true,
    note: 'This field will allow for CMAP filtering by project theme/format/etc on the CMAP alumni page.'
  },
	project: { type: Types.Markdown, label: 'Project Description', 
		dependsOn: { category: ['CMAP', 'advisory board'] }, note: 'This field is for students and board members, and will display beneath the regular bio text on the person\'s individual page.'},
	
	bio: { type: Types.Markdown, label: 'Bio', required: true, initial: true },
	image: { type: Types.CloudinaryImage, label: 'Image', folder: 'site/team', note: 'Must be in square format. Will display as 192px by 192px.' },
	
	cmapPerson: { type: Types.Boolean, label: 'Show on CMAP page', dependsOn: { category: ['faculty leadership', 'faculty fellows'] }, note: 'This field is for faculty leadership and fellows, to display them in the CMAP faculty section.'},
	
	twitterURL: { type: Types.Url, label: 'Twitter', note: 'This will display on the person\'s individual page' },	
	fbURL: { type: Types.Url, label: 'Facebook', note: 'This will display on the person\'s individual page' },	
	linkedInURL: { type: Types.Url, label: 'LinkedIn', note: 'This will display on the person\'s individual page' },	
	githubURL: { type: Types.Url, label: 'Github', note: 'This will display on the person\'s individual page' },
	websiteURL: { type: Types.Url, label: 'Website', note: 'This will display on the person\'s individual page' },	

	email: { type: String, label: 'Email', note: 'This will display on the person\'s individual page' },
	phone: { type: String, label: 'Phone', note: 'This will display on the person\'s individual page' }
	
});

/**
 * Hooks
 * =============
 */
Person.schema.pre('save', function(next) {

    // Save state for post hook
    this.wasNew = this.isNew;
    this.wasModified = this.isModified();

    next();

});

Person.schema.post('save', function(next) {

    // Make a post to slack when this Person is updated
    var person = this;
    
    keystone.get('slack').Post(
    	Person.model, this, true, 
    	function() { return person.name.first + ' ' + person.name.last; }
    );

});


/**
 * Model Registration
 */
// Person.defaultSort = 'sortOrder';
Person.defaultColumns = 'name, category';
Person.register();
