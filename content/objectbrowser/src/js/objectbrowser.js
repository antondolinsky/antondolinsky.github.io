var objbrowseritem = function(templates, key, value, isexpanded) {
	var type = typeof(value);
	var specifictype = ((value instanceof Array) ? 'array' : type);
	var isobjectorfunction = ((type === 'object') || (type === 'function'));
	var isoutlinked = (isobjectorfunction && (Object.keys(value).length > 0));
	var valuesummary = ((type === 'object') ? null :
		((type === 'function') ? 'function' : value.toString()));
	var $item = domfromstr(templates.item)[0];
	var $ec = domqsaarray('[data-expandcollapse]', $item)[0];
	var $ch = domqsaarray('[data-children]', $item)[0];
	domfillfields($item, 'data-field', {
		key: key,
		valuesummary: valuesummary
	});
	domsetattributes($item, {
		'data-key': key,
		'data-type': type,
		'data-specifictype': specifictype,
		'data-isoutlinked': isoutlinked,
		'data-hasbeenexpanded': false,
		'data-selected': false
	});
	var expandcollapse = function(mode) {
		if (mode) {
			if ($item.getAttribute('data-hasbeenexpanded') === 'false') {
				objeach(value, function(key, value) {
					var $item = objbrowseritem(templates, key, value, false);
					$ch.appendChild($item);
				});
				$item.setAttribute('data-hasbeenexpanded', true);
			}
		}
		$item.setAttribute('data-isexpanded', mode);
	};
	if (isoutlinked) {
		expandcollapse(isexpanded);
		$ec.addEventListener('click', function(e) {
			expandcollapse($item.getAttribute('data-isexpanded') !== 'true');
		});
	}
	return $item;
};

var objectbrowser = function(templates) {
	var $element = domfromstr(templates.objectbrowser)[0];
	var $items = domqsaarray('[data-items]', $element)[0];
	var root;
	var history = [];
	var objectbrowser = {
		dom: function() {
			return $element;
		},
		clearhistory: function() {
			history = [];
			if (root) { history.push(root); }
		},
		set: function(_root) {
			root = _root;
			history.push(root);
			var $rootitem = objbrowseritem(templates, null, root, true);
			domempty($items);
			$items.appendChild(domqsaarray('[data-children]', $rootitem)[0]);
		}
	};
	return objectbrowser;
};