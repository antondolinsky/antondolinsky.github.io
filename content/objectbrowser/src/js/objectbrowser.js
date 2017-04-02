var objbrowseritem = function(templates, key, value, isexpanded) {
	var type = typeof(value);
	var specifictype = ((value instanceof Array) ? 'array' : type);
	var isobjectorfunction = ((type === 'object') || (type === 'function'));
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
	domsetattributes(item, {
		'data-key': key,
		'data-type': type,
		'data-specifictype': specifictype,
		'data-isobjectorfunction': isobjectorfunction,
		'data-isexpandable': isexpandable,
		'data-isoutlinked': isoutlinked
	});
	var expandcollapse = function(mode) {
		item.setAttribute('data-isexpanded', mode);
		if (mode) {
			domempty(ch);
			objeach(value, function(key, value) {
				var item = objbrowseritem(templates, key, value, false);
				ch.appendChild(item);
			});
		}
	};
	if (isexpandable) {
		expandcollapse(isexpanded);
		ec.addEventListener('click', function(e) {
			expandcollapse(item.getAttribute('data-isexpanded') !== 'true');
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
			var rootitem = objbrowseritem(templates, null, root, true);
			domempty(items);
			items.appendChild(domqsaarray('[data-children]', rootitem)[0]);
		}
	};
	return objectbrowser;
};