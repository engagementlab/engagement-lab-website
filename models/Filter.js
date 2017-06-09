/**
 * Boston Civic Media
 * 
 * Research category Modelz
 * @class Filters
 * @author Erica Salling
 * 
 * For field docs: http://keystonejs.com/docs/database/
 *
 * ==========
 */

var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * @module Filters
 * @constructor
 * See: http://keystonejs.com/docs/database/#lists-options
 */
var Filters = new keystone.List('Filter', 
{
	name: 'Filters',
	singular: 'Filter',
  hidden: false,
  nodelete: false,
  sortable: true,
  autokey: { path: 'key', from: 'name', unique: false }
});

/**
 * Model Fields
 * @main Project
 */
Filters.add({
    name: { type: String, label: 'Name', required: true, initial: true, index: true },
    category: { type: Types.Select, label: 'Type', options: 'Person, Type, Topic', required: true, initial: true },
	  
	  contactEmail: { type: Types.Email, label: 'Email', required: false, dependsOn: {category: 'Person'} }
});


Filters.schema.pre('remove', function(next) {

  // Remove resource from all that referenced it 
	keystone.list('Syllabi').model.removeFilterRef(this._id, function(err, removedCount) {

		if(err)
			console.error(err);
    
		if(removedCount > 0)
			console.log("Removed " +  removedCount + " references to '"+ this._id + "'");
		
		next();

	});

});

/**
 * Model Registration
 * =============
 */
Filters.defaultSort = 'category';
Filters.defaultColumns = 'name, category';
Filters.register();

