var dom = {
	empty: function($element) {
		while ($element.firstChild) {
			$element.removeChild($element.firstChild);
		}
	},
	fillfields: function($root, attributename, values) {
	  dom.qsaarray('[' + attributename + ']', $root).forEach(function($element) {
	  	var attribute = $element.getAttribute(attributename);
	  	if (attribute !== null) {
		    var value = objpath(values, attribute.split('.'));
		    if (['INPUT', 'SELECT'].indexOf($element.tagName) === -1) {
		      $element.innerHTML = value;
		    } else {
		      $element.value = value;
		    }
		  }
	  });
	},
	fromstr: function(str) {
		var $div = document.createElement('DIV');
		$div.innerHTML = str;
		var $elements = Array.prototype.slice.call($div.children);
		return $elements;
	},
	qsaarray: function(selectors, $root) {
		if (! $root) { $root = document; }
		var nodelist = $root.querySelectorAll(selectors);
		var $elements = Array.prototype.slice.call(nodelist);
		return $elements;
	},
	setattributes: function($element, values) {
		objeach(values, function(key, value) {
			$element.setAttribute(key, value);
		});
	}
};