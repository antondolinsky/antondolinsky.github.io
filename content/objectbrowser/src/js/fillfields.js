var fillfields = function(root, attributename, values) {
  qsaarray('[' + attributename + ']', root).forEach(function(element) {
  	var attribute = element.getAttribute(attributename);
  	if (attribute !== null) {
	    var value = objpath(values, attribute.split('.'));
	    if (['INPUT', 'SELECT'].indexOf(element.tagName) === -1) {
	      element.innerHTML = value;
	    } else {
	      element.value = value;
	    }
	  }
  });
};