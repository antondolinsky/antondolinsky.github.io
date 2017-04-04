var strreplaceall = function(str, pre, post) {
	while (true) {
		var index = str.indexOf(pre);
		if (index === -1) { break; }
		else { str = str.replace(pre, post); }
	}
};