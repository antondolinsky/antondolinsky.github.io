var domfromstr = function(str) {
	var div = document.createElement('DIV');
	div.innerHTML = str;
	return Array.prototype.slice.call(div.children);
};