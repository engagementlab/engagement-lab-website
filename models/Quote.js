/**
 * Engagement Lab Website
 * 
 * Quote page parent Model
 * @module team
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
 * @module team
 * @constructor
 * See: http://keystonejs.com/docs/database/#lists-options
 */
var Quote = new keystone.List('Quote', 
	{
		label: 'Quotes',
		singular: 'Quote',
		sortable: true,
		track: true,
		autokey: { path: 'key', from: 'name', unique: true }
	});

/**
 * Model Fields
 * @main Quote
 */
Quote.add({

	name: { type: String, label: 'name', required: true, initial: true, index: true },

	quote: { type: Types.Markdown, label: 'Quote', required: true, initial: true, note: 'This is the body of the quote' },
	cmapQuote: { type: Types.Boolean, label: 'Show on CMAP page', note: 'All quotes with this enabled will appear on the CMAP page in the quotes section' },	
	person: { 
		type: Types.Relationship, 
		label: 'Author', 
		ref: 'Person'
	},
	
	createdAt: { type: Date, default: Date.now, noedit: true, hidden: true }

});

/**
 * Model Registration
 */
Quote.defaultSort = 'sortOrder';
Quote.defaultColumns = 'name';
Quote.register();
