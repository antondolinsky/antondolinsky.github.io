var objpath = function(obj, path, value) {
  var prevobj = null;
  for (var i = 0; i < path.length; i += 1) {
    key = path[i];
    prevobj = obj;
    obj = prevobj[key];
    if (obj === undefined) {
      if (i < (path.length - 1)) {
        return;
      }
    }
  }
  if (value) {
    prevobj[key] = value;
  }
  return prevobj[key];
};