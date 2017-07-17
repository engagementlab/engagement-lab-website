/**
 * Engagement Lab Website
 * 
 * Project Model
 * @module project
 * @author Johnny Richardson
 * 
 * For field docs: http://keystonejs.com/docs/database/
 *
 * ==========
 */
var keystone = require('keystone');
// See: https://github.com/chriso/validator.js
var validator = require('validator');
var Listing = require('./Listing');
var Types = keystone.Field.Types;

/**
 * @module project
 * @constructor
 * See: http://keystonejs.com/docs/database/#lists-options
 */
var Project = new keystone.List('Project', {
    inherits: Listing,
    hidden: false
});

/**
 * Field Validators
 * @main Project
 */
var urlValidator = {
    validator: function(val) {
        return !val || validator.isURL(val, {
            protocols: ['http', 'https'],
            require_tld: true,
            require_protocol: false,
            allow_underscores: true
        });
    },
    msg: 'Invalid link URL (e.g. needs http:// and .org/)'
};

// Storage adapter for Azure
var azureFile = new keystone.Storage({
  adapter: require('keystone-storage-adapter-azure'),
  azure: {
    container: 'elabproject',
    generateFilename: keystone.Storage.originalFilename
  }
});

/**
 * Model Fields
 * @main Project
 */
Project.add({

    format: {
        type: Types.Relationship,
        ref: 'Filter',
        filters: {
            category: 'Format',
            appears: 'Project'
        },
        label: 'Type/Format of Project', 
        note: 'What kind of project is this? Choose from below or add a Format Filter and choose \'Project\' as its destination.'
    },
    keyword: {
        type: Types.Relationship,
        ref: 'Filter',
        filters: {
            category: 'Keyword',
            appears: 'Project'
        },
        label: 'Project Keywords', 
        many: true,
        note: 'What kind of project is this? Choose from below or add a Keyword Filter and choose \'Project\' as its destination.'
    },
    person: {
        type: Types.Relationship,
        ref: 'Filter',
        filters: {
            category: 'Person'
        },
        label: 'Project People Filters', 
        many: true,
        note: 'Who is on this project? Choose from below or add a Person Filter.'
    },
    subdirectory: {
        type: Types.Relationship,
        ref: 'Subdirectory',
        required: true,
        initial: true,
        label: 'Subdirectory', 
        note: 'This is the Project subdirectory in which this project will be grouped.'
    },
    enabled: {
        type: Types.Boolean,
        label: 'Enabled', 
        note: 'Determines if this project appears on the live site.'
    },
    featured: {
        type: Types.Boolean,
        label: 'Featured', 
        note: 'Determines if this project appears on the home page in the featured project slider.'
    },
    cmapProject: {
        type: Types.Boolean,
        label: "CMAP Project", 
        note: 'Determines if this project appears on the CMAP page.'
    },
    overview: {
        type: Types.Markdown,
        label: 'Project Narrative',
        initial: true,
        required: true, 
        note: 'Appears on the individual project page under \'About\''
    },
    headerImage: {
        type: Types.CloudinaryImage,
        label: 'Header Image (large)',
        folder: 'site/research/projects',
        autoCleanup: true, 
        note: 'Appears at the top of the individual project page, behind the project name.'
    },
    sideImage: {
        type: Types.CloudinaryImage,
        label: 'Side Column Image (small)',
        folder: 'site/research/projects',
        autoCleanup: true,
        note: 'Dimensions should be 360x360. Appears next to the project narrative on the individual project page. '
    }
},

'Project Information', {

    startDate: {
        type: Date,
        label: 'Project Start Date',
        initial: true,
        required: true, 
        note: 'Appears on the individual project page.'
    },
    endDate: {
        type: Date,
        label: 'Project End Date', 
        note: 'Appears on the individual project page.'

    },

    principalInvestigator: {
        type: Types.Relationship,
        ref: 'Filter',
        filters: {
            type: 'Person'
        },
        label: 'Principal Investigator', 
        note: 'Appears on the individual project page.'

    },

    managerPerson: {
        type: String,
        label: 'Project Manager',
        note: 'Appears on the individual project page.'

    },
    
    externalLinkUrl: {
        type: Types.Url,
        label: 'Project Website URL',
        validate: urlValidator,
        note: 'Must be in format "http://www.something.org" <br> Appears on the individual project page.'
    },
    githubUrl: {
        type: Types.Url,
        label: 'Github URL',
        validate: urlValidator,
        note: 'Must be in format "http://www.something.org" <br> Appears on the individual project page.'
    }
    /*executiveSummaryFile: {
        type: Types.AzureFile,
        label: 'Executive Summary Report',
        filenameFormatter: function(item, filename) {
            return item.key + require('path').extname(filename);
        },
        containerFormatter: function(item, filename) {
            return 'resources';
        }
    }*/

},

'Project Media', {
    projectImages: {
        type: Types.CloudinaryImages,
        label: 'Project Images',
        folder: 'site/research/projects',
        autoCleanup: true, 
        note: 'Will appear in \'Images\' tab on individual project page.'
    },
    projectImageCaptions: {
        type: Types.TextArray,
        label: 'Project Image Captions',
        note: 'Each image specified above must have a caption'
    },
    // Resource model reference for videos
    videos: {
        type: Types.Relationship,
        ref: 'Resource',
        label: 'Project Videos',
        filters: {
            type: 'video'
        },
        many: true,
        note: 'Will appear in \'Videos\' tab on individual project page.'

    },
    // Resource model reference for files
    files: {
        type: Types.Relationship,
        ref: 'Resource',
        label: 'Project Files',
        filters: {
            type: 'file'
        },
        many: true,
        note: 'Will appear in \'Resources\' tab on individual project page.'

    },
    // Resource model reference for articles
    articles: {
        type: Types.Relationship,
        ref: 'Resource',
        label: 'External Articles',
        filters: {
            type: 'article'
        },
        many: true,
        note: 'Will appear in \'News\' section on individual project page.'

    },
    // Resource model reference for articles
    blogs: {
        type: Types.Relationship,
        ref: 'Resource',
        label: 'Blog Posts',
        filters: {
            type: 'blog post'
        },
        many: true,
        note: 'Will appear in \'News\' section on individual project page.'

    }
},

'Custom Project Tabs', {
    customTabs: {
        type: Types.Markdown,
        label: 'Custom Tabs',
        note: 'Each tab heading is designated by an <span class="btn-default btn-sm btn"><span></span>H1</span>, with body text below it'
    },
    tabHeadings: {
        type: Types.TextArray,
        label: 'Custom Tab Heading',
        note: 'Please ensure each tab you add has corresponding text',
        hidden: true
    },
    tabText: {
        type: Types.TextArray,
        label: 'Custom Tab Text',
        hidden: true
    }
});

/**
 * Methods
 * =============
 */

// Remove a given resource from all projects that referenced it (videos and articles as of now)
Project.schema.statics.removeResourceRef = function(resourceId, callback) {

    Project.model.update({
            $or: [{
                'videos': resourceId
            }, {
                'articles': resourceId
            }, {
                'blogs': resourceId
            }, {
                'files': resourceId
            }]
        },

        {
            $pull: {
                'videos': resourceId,
                'articles': resourceId,
                'blogs': resourceId,
                'files': resourceId
            }
        },

        {
            multi: true
        },

        function(err, result) {

            callback(err, result);

            if (err)
                console.error(err);
        }
    );

};

/**
 * Hooks
 * =============
 */
Project.schema.pre('save', function(next) {

    // Save state for post hook
    this.wasNew = this.isNew;
    this.wasModified = this.isModified();

    if (this.projectImages.length > 0 && (this.projectImages.length < this.projectImageCaptions.length)) {
        var err = new Error('You cannot have more images than their respective captions.');
        next(err);
    }

    next();

});

Project.schema.post('save', function(next) {
    // Make a post to slack when this Project is updated
    keystone.get('slack').Post(Project.model, this, true);

});

/**
 * Model Registration
 */
Project.defaultSort = 'sortOrder';
Project.defaultColumns = 'name, subdirectory, enabled, featured';
Project.register();