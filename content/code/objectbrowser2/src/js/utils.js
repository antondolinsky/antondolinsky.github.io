var utils = {
	objeach: function(obj, cb) {
		for (var key in obj) {
			if (obj.hasOwnProperty(key)) {
				cb(key, obj[key], obj);
			}
		}
	},
	objpath: function(obj, path, value) {
	  var prevobj = null;
	  for (var i = 0; i < path.length; i += 1) {
	    key = path[i];
	    prevobj = obj;
	    obj = prevobj[key];
	    if (obj === undefined) {
	      if (i < (path.length - 1)) {
	        return;
	      }
	    }
	  }
	  if (value) {
	    prevobj[key] = value;
	  }
	  return prevobj[key];
	},
	strreplaceall: function(str, pre, post) {
		while (true) {
			var index = str.indexOf(pre);
			if (index === -1) { break; }
			else { str = str.replace(pre, post); }
		}
	}
};