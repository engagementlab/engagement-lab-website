/**
 * Engagement Lab Website
 * 
 * TV Model
 * @module tv
 * @author Johnny Richardson
 * 
 * For field docs: http://keystonejs.com/docs/database/
 *
 * ==========
 */
var keystone = require('keystone');
var Listing = require('./Listing');
var Types = keystone.Field.Types;

/**
 * @module tv
 * @constructor
 * See: http://keystonejs.com/docs/database/#lists-options
 */
var TV = new keystone.List('TV', {
    plural: 'TV',
    nocreate: true,
    nodelete: true
});

/**
 * Model Fields
 * @main TV
 */
TV.add({
     name: {
        type: String,
        hidden: true,
        default: 'Lab TV Content'
    },
    currentBlurb: {
        type: String,
        label: 'Current Blurb',
    },
    slideshowImages: {
        type: Types.CloudinaryImages,
        folder: 'site/tv-slideshow',
        autoCleanup: true,
        required: true,
        initial: true,
        note: 'Dimensions should be 4032 × 3024.'
    }
});

/**
 * Model Registration
 */
TV.defaultSort = 'sortOrder';
TV.defaultColumns = 'name';
TV.register();