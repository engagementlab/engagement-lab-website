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
        type: Types.TextArray,
        label: 'Current Chyron Text',
        note: 'Text blurbs shown on chyron.'
    },
    slideshowImages: {
        type: Types.CloudinaryImages,
        folder: 'site/tv-slideshow',
        autoCleanup: true,
        required: true,
        initial: true,
        note: 'Dimensions should be 4032 × 3024. To re-order, remove and upload again.'
    },
    displayVideo: {
        type: Boolean,
        note: 'Show a video instead of image slideshow?'
    },
    videoId: {
        type: Number,
        dependsOn: { displayVideo: true },
        note: 'Vimeo video ID from its URL (e.g. 286424105). Video will autoplay and loop, and replaces slideshow.'
    }
});

/**
 * Hooks
 * =============
 */
TV.schema.pre('save', function(next) {

   if (this.displayVideo === true && (this.videoId === undefined || this.videoId.length < 1)) {
        var err = new Error('You cannot have display video enabled without video ID specified.');
        next(err);
    }

    next();

});

// Tell client of new data
TV.schema.post('save', function() {

    require('request').post('http://catan.dev.emerson.edu:8081/', (error, response, body) => {
        console.log('done');
    });

});

/**
 * Model Registration
 */
TV.defaultSort = 'sortOrder';
TV.defaultColumns = 'name';
TV.register();