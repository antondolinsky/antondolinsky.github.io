var domqsaarray = function(selectors, root) {
	if (! root) { root = document; }
	var nodelist = root.querySelectorAll(selectors);
	return Array.prototype.slice.call(nodelist);
};