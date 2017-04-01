var objectbrowser = function(templates) {
	var el = domfromstr(templates.objectbrowser)[0];
	var items = domqsaarray('data-items', el)[0];
	var root;
	var objectbrowser = {
		dom: function() {
			return el;
		},
		set: function(_root) {
			root = _root;
			domempty(items);
			objeach(root, function(key, value) {
				var item = domfromstr(templates.item)[0];
				domfillfields(item, 'data-field', {
					key: key,
					valuesummary: value.toString()
				});
				items.appendChild(item);
			});
		}
	};
	return objectbrowser;
};