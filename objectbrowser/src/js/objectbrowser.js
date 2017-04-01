var paths = {
	templates: {
		item: 'src/templates/item.html'
	}
};

var objectbrowser = function() {
	getfile(paths.templates.item).then(function(err, data) {
		console.log(data);
	});
};