module.exports = function() {

    var _helpers = {};

    _helpers.combine = function(str) {
    	var s = str.replace(/\s+/g, '-');
    	return s.toLowerCase();
    }


    return _helpers;
};