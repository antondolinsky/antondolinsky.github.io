var objbrowseritem = function(templates, key, value, isexpanded, eventscontroller) {
	var type = typeof(value);
	var specifictype = ((value instanceof Array) ? 'array' : type);
	var isobjectorfunction = ((type === 'object') || (type === 'function'));
	var isoutlinked = (isobjectorfunction && (Object.keys(value).length > 0));
	var valuesummary = ((type === 'object') ? null :
		((type === 'function') ? 'function' : value.toString()));
	var $item = domfromstr(templates.item)[0];
	var $ch = domqsaarray('[data-eltype-children]', $item)[0];
	var triggers = domqsaarray('[data-trigger]', $item).reduce(function(sofar, curr) {
		var key = curr.getAttribute('data-trigger');
		sofar[key] = curr;
		return sofar;
	}, {});
	domfillfields($item, 'data-field', {
		key: key,
		valuesummary: valuesummary
	});
	domsetattributes($item, {
		'data-prop-key': key,
		'data-prop-type': type,
		'data-prop-specifictype': specifictype,
		'data-prop-isoutlinked': isoutlinked,
		'data-prop-hasbeenexpanded': false,
		'data-prop-selected': false
	});
	var expandcollapse = function(mode) {
		if (mode) {
			if ($item.getAttribute('data-prop-hasbeenexpanded') === 'false') {
				objeach(value, function(key, value) {
					var $item = objbrowseritem(templates, key, value, false, eventscontroller);
					$ch.appendChild($item);
				});
				domsetattributes($item, {
					'data-prop-hasbeenexpanded': true
				});
			}
		}
		domsetattributes($item, {
			'data-prop-isexpanded': mode
		});
	};
	triggers.$select.addEventListener('click', function(e) {
		var mode = ($item.getAttribute('data-prop-selected') === 'false');
		domsetattributes($item, {
			'data-prop-selected': mode
		});
		eventscontroller('setselected', [value, $item, mode]);
	});
	if (isoutlinked) {
		expandcollapse(isexpanded);
		triggers.$expand.addEventListener('click', function(e) {
			var mode = ($item.getAttribute('data-prop-isexpanded') !== 'true');
			expandcollapse(mode);
			eventscontroller('setexpanded', [value, $item, mode]);
		});
	}
	return $item;
};

var objectbrowser = function(templates) {
	var $element = domfromstr(templates.objectbrowser)[0];
	var $items = domqsaarray('[data-eltype-items]', $element)[0];
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
			$items.appendChild(domqsaarray('[data-eltype-children]', $rootitem)[0]);
		}
	};
	return objectbrowser;
};