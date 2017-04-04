var async = {
	all: function(promises) {
		var args = {};
		return (new Promise(function(resolve, reject) {
			objeach(promises, function(key, value) {
				value.then(function() {
					args[key] = Array.prototype.slice.call(arguments);
					if (Object.keys(args).length === Object.keys(promises).length) {
						resolve(args);
					}
				});
			});
		}));
	}
};