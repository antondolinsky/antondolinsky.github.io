var domsetattributes = function(el, values) {
	objeach(values, function(key, value) {
		el.setAttribute(key, value);
	});
};