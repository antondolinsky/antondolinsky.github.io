var xhr = {
	get: function(path) {
		return (new Promise(function(resolve, reject) {
			var xhr = (new XMLHttpRequest());
			xhr.open("GET", path, true);
			xhr.onload = function(e) {
			  if (xhr.readyState === 4) {
			    if (xhr.status === 200) {
			      resolve(xhr.responseText);
			    } else {
			      reject(new Error(xhr.statusText));
			    }
			  }
			};
			xhr.onerror = function (e) {
			  reject(new Error(xhr.statusText));
			};
			xhr.send(null);
		}));
	},
	getmultiple: function(paths) {
		var promises = {};
		utils.objeach(paths, function(key, value) {
			promises[key] = xhr.getfile(value);
		});
		return async.all(promises).then(function(data) {
			utils.objeach(data, function(key, value) {
				data[key] = value[0];
			});
			return data;
		});
	}
};