var paths = {
	templates: {
		objectbrowser: 'src/templates/objectbrowser.html',
		item: 'src/templates/item.html'
	}
};

var testval = {
	a: 'hello',
	b: 3
};

var main = function() {
	getfiles(paths.templates).then(function(templates) {
		var ob = objectbrowser(templates);
		ob.set(testval);
		document.body.appendChild(ob.getRoot());
	});
};