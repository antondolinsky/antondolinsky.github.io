var domfromstr = function(str) {
	var $div = document.createElement('DIV');
	$div.innerHTML = str;
	var $elements = Array.prototype.slice.call($div.children);
	return $elements;
};