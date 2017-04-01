var template = function(str, context) {
	objeach(context, function(key, value) {
		str = strreplaceall(str, ('{{' + key + '}}'), value);
	});
	return str;
};