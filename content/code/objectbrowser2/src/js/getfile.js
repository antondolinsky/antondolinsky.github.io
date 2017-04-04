var getfile = function(path) {
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
};