/**
 * @type {String}
 * Document Server Component Library JS
 * @properties={typeid:35,uuid:"BC701453-C52E-4607-84A8-FED0518EC3DC"}
 */
var docServerJS = 'http://192.168.192.131/web-apps/apps/api/documents/api.js';

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"F4A17B0E-AB65-4AB8-9F6A-658BF2544E58"}
 */
var conversionAPI = "http://192.168.192.131/ConvertService.ashx"

/**
 * @type {String}
 * REST Endpoint that manages documents
 * @properties={typeid:35,uuid:"FD1B9AA6-5259-4F53-A43B-1CB15E10DFF0"}
 */
var servoyMGMServer = 'http://192.168.86.200:8080/servoy-service/rest_ws/ws/mgm';

/**
 * Callback method for when solution is opened.
 * When deeplinking into solutions, the argument part of the deeplink url will be passed in as the first argument
 * All query parameters + the argument of the deeplink url will be passed in as the second argument
 * For more information on deeplinking, see the chapters on the different Clients in the Deployment Guide.
 *
 * @param {String} arg startup argument part of the deeplink url with which the Client was started
 * @param {Object<Array<String>>} queryParams all query parameters of the deeplink url with which the Client was started
 *
 * @properties={typeid:24,uuid:"1767511A-642C-4A17-A984-5B041122E541"}
 */
function onSolutionOpen(arg, queryParams) {
	if (!application.isInDeveloper()) {
		servoyMGMServer = application.getServerURL() + '/servoy-service/rest_ws/ws/mgm';
	}
	plugins.ngclientutils.setViewportMetaForMobileAwareSites(plugins.ngclientutils.VIEWPORT_MOBILE_DEFAULT)
//	var fs = datasources.db.onlyoffice.files.getFoundSet();
//	fs.loadAllRecords();
//	fs.deleteAllRecords();
}

/**
 * Convert from one document type to another.
 * https://api.onlyoffice.com/editors/conversionapi#async
 * @properties={typeid:24,uuid:"369E8DF8-94FA-4774-AD55-AD1D4B3F3932"}
 */
function convert(file_type, outputtype, key, title, url) {
	if (application.isInDeveloper()) {
		url = url.replace('localhost', '192.168.86.200');
	}
	var data = {
		"async": false,
		"filetype": file_type,
		"key": key,
		"outputtype": outputtype,
		"title": title,
		"url": url
	}
	var c = plugins.http.createNewHttpClient();
	var p = c.createPostRequest(conversionAPI);
	p.addHeader('accept', 'application/json');
	p.setBodyContent(JSON.stringify(data))
	var e = p.executeRequest();
	/** @type {{key:String, error:Number,fileUrl:String}} */
	var r = JSON.parse(e.getResponseBody());
	if (r.fileUrl) {
		application.showURL(r.fileUrl);
	} else {
		plugins.svyBlockUI.stop();
		plugins.dialogs.showInfoDialog('INFO', 'Conversion failed..Did you pick the correct output type?')
	}
	plugins.svyBlockUI.stop();
	return e.getStatusCode();
}
