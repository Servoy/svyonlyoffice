angular.module('svyonlyofficeEditor', ['servoy']).directive('svyonlyofficeEditor', function() {
		return {
			restrict: 'E',
			scope: {
				model: '=svyModel',
				handlers: "=svyHandlers",
				api: "=svyApi",
				svyServoyapi: "=",
				servoyApi: '=svyServoyapi'
			},
			controller: function($services, $scope, $element, $attrs, $window, $timeout) {
				$scope.Doc = null;
				$scope.Property;
				$scope.lib;
				$scope.properties;
				$scope.callback;

				$scope.servoyApi.callServerSideApi("getData", []).then(function(r) {
					if (r.properties && r.callback) {
						$scope.lib = r.lib;
						$scope.properties = r.properties;
						$scope.callback = r.callback;
						$scope.api.init($scope.lib);
					}
				});

				$scope.api.init = function(lib) {
					$scope.servoyApi.callServerSideApi("setData", [lib]);
					if (!$scope.Doc) {
						var head = document.getElementsByTagName('head')[0];
						var script = document.createElement('script');
						script.type = 'text/javascript';
						script.onload = function() {
							$scope.api.load($scope.properties, $scope.callback);
						}
						script.src = lib;
						head.appendChild(script);
					}

				}

				$scope.api.load = function(property, cb) {
					$scope.servoyApi.callServerSideApi("setData", [null, property, cb]);
					function isMobile() {
						var prefixes = { ios: 'i(?:Pad|Phone|Pod)(?:.*)CPU(?: iPhone)? OS ', android: '(Android |HTC_|Silk/)', blackberry: 'BlackBerry(?:.*)Version\/', rimTablet: 'RIM Tablet OS ', webos: '(?:webOS|hpwOS)\/', bada: 'Bada\/' }, i, prefix, match;
						for (i in prefixes) {
							if (prefixes.hasOwnProperty(i)) {
								prefix = prefixes[i];
								if (navigator.userAgent.match(new RegExp('(?:' + prefix + ')([^\\s;]+)'))) return true;
							}
						}
						return false;
					}

					if (isMobile()) {
						property.type = 'mobile';
					}
					if (!DocsAPI) return;
					$scope.Doc = new DocsAPI.DocEditor($scope.model.svyMarkupId + '-oo_editor', property);
					$scope.Property = property;
					if (cb) {
						$window.executeInlineScript(cb.formname, cb.script, [property]);
					}
				}

				$scope.api.destroy = function() {
					if ($scope.Doc) {
						$scope.Doc.destroyEditor();
					}
				}

			},
			templateUrl: 'svyonlyoffice/editor/editor.html'
		};
	})