var objbrowseritem = function(templates, key, value, pathsofar, expanded) {
	var path = pathsofar.slice();
	path.push(key);
	var item = domfromstr(templates.item)[0];
	var ec = domqsaarray('[data-expandcollapse]', item)[0];
	var ch = domqsaarray('[data-children]', item)[0];
	domfillfields(item, 'data-field', {
		key: key,
		valuesummary: value.toString()
	});
	item.setAttribute('data-path', path.join('.'));
	var isexpandable = (value instanceof Object);
	var haschildren = (isexpandable && (Object.keys(value).length > 0));
	item.setAttribute('data-isexpandable', isexpandable);
	item.setAttribute('data-haschildren', haschildren);
	var expandcollapse = function(mode) {
		if (mode) {
			ch.style.display = 'none';
		} else {
			ch.style.display = 'initial';
			domempty(ch);
			objeach(value, function(key, value) {
				var item = objbrowseritem(templates, key, value, path);
				ch.appendChild(item);
			});
		}
		ec.setAttribute('data-expanded', (! mode));
	};
	expandcollapse(expanded);
	if (ec && isexpandable) {
		ec.setAttribute('data-expanded', 'false');
		ec.addEventListener('click', function(e) {
			expandcollapse(ec.getAttribute('data-expanded') === 'true');
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
		}
	};
	return objectbrowser;
};