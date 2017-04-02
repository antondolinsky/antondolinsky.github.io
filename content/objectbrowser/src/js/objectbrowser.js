var objbrowseritem = function(templates, key, value, pathsofar, isexpanded) {
	var path = pathsofar.slice();
	if (key) {
		path.push(key);
	}
	var type = typeof(value);
	var isobjectorfunction = (type === 'object' || type === 'function');
	var isexpandable = isobjectorfunction;
	var isoutlinked = (isexpandable && (Object.keys(value).length > 0));
	var valuesummary = ((type === 'object') ? null :
		((type === 'function') ? 'function' : value.toString()));
	var item = domfromstr(templates.item)[0];
	var ec = domqsaarray('[data-expandcollapse]', item)[0];
	var ch = domqsaarray('[data-children]', item)[0];
	domfillfields(item, 'data-field', {
		key: key,
		valuesummary: valuesummary
	});
	item.setAttribute('data-path', path.join('.'));
	item.setAttribute('data-type', type);
	item.setAttribute('data-isexpandable', isexpandable);
	item.setAttribute('data-isoutlinked', isoutlinked);
	var expandcollapse = function(mode) {
		item.setAttribute('data-isexpanded', mode);
		if (mode) {
			domempty(ch);
			objeach(value, function(key, value) {
				var item = objbrowseritem(templates, key, value, path, false);
				ch.appendChild(item);
			});
		}
		item.setAttribute('data-isexpanded', (! mode));
	};
	if (isexpandable) {
		expandcollapse(isexpanded);
	}
	if (ec && isexpandable) {
		ec.addEventListener('click', function(e) {
			expandcollapse(item.getAttribute('data-isexpanded') === 'true');
		});
	}
	return item;
};

var objectbrowser = function(templates) {
	var el = domfromstr(templates.objectbrowser)[0];
	var items = domqsaarray('[data-items]', el)[0];
	var root;
	var objectbrowser = {
		dom: function() {
			return el;
		},
		set: function(_root) {
			root = _root;
			var rootitem = objbrowseritem(templates, null, root, [], true);
			domempty(items);
			items.appendChild(domqsaarray('[data-children]', rootitem)[0]);
		}
	};
	return objectbrowser;
};