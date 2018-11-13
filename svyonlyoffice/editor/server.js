var lib;
var properties;
var callback;

$scope.setData = function(l, p, c, s) {
	if (l) lib = l;
	if (p) properties = p;
	if (c) callback = c;
}

$scope.getData = function() {
	return {
		lib: lib,
		properties: properties,
		callback: callback
	}
}