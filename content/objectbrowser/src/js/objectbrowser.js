var objbrowseritem = function(templates, key, value, isexpanded, eventscontroller) {
	var type = typeof(value);
	var specifictype = ((value instanceof Array) ? 'array' : type);
	var isobjectorfunction = ((type === 'object') || (type === 'function'));
	var isoutlinked = (isobjectorfunction && (Object.keys(value).length > 0));
	var valuesummary = ((type === 'object') ? null :
		((type === 'function') ? 'function' : value.toString()));
	var $item = domfromstr(templates.item)[0];
	var $ec = domqsaarray('[data-expandcollapse]', $item)[0];
	var $ch = domqsaarray('[data-children]', $item)[0];
	var $rest = domqsaarray('[data-rest]', $item)[0];
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
					var $item = objbrowseritem(templates, key, value, false, eventscontroller);
					$ch.appendChild($item);
				});
				domsetattributes($item, {
					'data-hasbeenexpanded': true
				});
			}
		}
		domsetattributes($item, {
			'data-isexpanded': mode
		});
	};
	$rest.addEventListener('click', function(e) {
		var mode = ($item.getAttribute('data-selected') === 'false');
		domsetattributes($item, {
			'data-selected': mode
		});
		eventscontroller('setselected', [value, $item, mode]);
	});
	if (isoutlinked) {
		expandcollapse(isexpanded);
		$ec.addEventListener('click', function(e) {
			var mode = ($item.getAttribute('data-isexpanded') !== 'true');
			expandcollapse(mode);
			eventscontroller('setexpanded', [value, $item, mode]);
		});
	}
	return $item;
};

var objectbrowser = function(templates) {
	var $element = domfromstr(templates.objectbrowser)[0];
	var $items = domqsaarray('[data-items]', $element)[0];
	var root;
	var history = [];
	var listeners = {
		setexpanded: [
			function(value, $item, mode) {

			}
		],
		setselected: [
			function(value, $item, mode) {

			}
		]
	};
	var eventscontroller = function(type, args) {
		if (listeners.hasOwnProperty(type)) {
			listeners.type.forEach(function(cb) {
				cb.apply(null, args);
			});
		}
	};
	var objectbrowser = {
		listen: function(type, cb) {
			if (! listeners.hasOwnProperty(type)) {
				listeners[type] = [];
			}
			listeners[type].push(cb);
		},
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
			var $rootitem = objbrowseritem(templates, null, root, true, eventscontroller);
			domempty($items);
			$items.appendChild(domqsaarray('[data-children]', $rootitem)[0]);
		}
	};
	return objectbrowser;
};