var objeach = function(obj, cb) {
	for (var key in obj) {
		if (obj.hasOwnProperty(key)) {
			cb(key, obj[key], obj);
		}
	}
};