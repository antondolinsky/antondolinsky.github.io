var getfiles = function(paths) {
	var promises = {};
	objeach(paths, function(key, value) {
		promises[key] = getfile(value);
	});
	return async.all(promises).then(function(data) {
		objeach(data, function(key, value) {
			data[key] = value[0];
		});
	});
};