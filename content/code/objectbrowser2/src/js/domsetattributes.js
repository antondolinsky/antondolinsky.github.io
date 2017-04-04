var domsetattributes = function($element, values) {
	objeach(values, function(key, value) {
		$element.setAttribute(key, value);
	});
};