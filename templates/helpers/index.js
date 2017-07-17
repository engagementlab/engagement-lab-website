module.exports = function() {

    var _helpers = {};

    _helpers.combine = function(str) {
    	var s = str.replace(/\s+/g, '-');
    	return s.toLowerCase();
    }

    _helpers.ifeqor = function(a, arr, options) {
        var or = false;
        _.each(arr, function(b){
            if (a == b) {
                or = true;
            }
        });

        if (or == true) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
        
    };


    return _helpers;
};