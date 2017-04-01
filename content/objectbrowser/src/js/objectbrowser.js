var objectbrowser = function(templates) {
	var el = domfromstr(templates.objectbrowser)[0];
	var items = domqsaarray('data-items', el);
	var root;
	var objectbrowser = {
		dom: function() {
			return el;
		},
		set: function(_root) {
			root = _root;
			domempty(items);
			objeach(root, function(key, value) {
				var item = domfromstr(templates.item);
				domfillfields(item, 'data-field', {
					key: key,
					valuesummary: value.toString()
				});
			});
		}
	};
	return objectbrowser;
};