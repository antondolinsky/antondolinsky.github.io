var paths = {
	templates: {
		item: 'src/templates/item.html'
	}
};

var main = function() {
	getfiles(paths.templates).then(function(templates) {
		objectbrowser(templates);
	});
};