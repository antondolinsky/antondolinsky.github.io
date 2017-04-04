var domqsaarray = function(selectors, $root) {
	if (! $root) { $root = document; }
	var nodelist = $root.querySelectorAll(selectors);
	var $elements = Array.prototype.slice.call(nodelist);
	return $elements;
};