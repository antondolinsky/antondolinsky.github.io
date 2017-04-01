var paths = {
	templates: {
		item: 'src/templates/item.html'
	}
};

var objectbrowser = function() {
	getfiles(paths.templates).then(function(templates) {
		console.log(templates);
	});
};