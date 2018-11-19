/**
 * @type {String}
 * Document Server Component Library JS
 * IMPORTANT: Must change IP address to point your local installation of document server
 * @properties={typeid:35,uuid:"BC701453-C52E-4607-84A8-FED0518EC3DC"}
 */
var docServerJS = 'http://192.168.192.131/web-apps/apps/api/documents/api.js';

/**
 * @type {String}
 * Must change IP address to point your local installation of document server
 * @properties={typeid:35,uuid:"F4A17B0E-AB65-4AB8-9F6A-658BF2544E58"}
 */
var conversionAPI = "http://192.168.192.131/ConvertService.ashx"

/**
 * @type {String}
 * REST Endpoint that manages documents
 * IMPORTANT: If testing with developer, make sure ip address is pointed to local ipaddress and not localhost
 * @properties={typeid:35,uuid:"FD1B9AA6-5259-4F53-A43B-1CB15E10DFF0"}
 */
var servoyMGMServer = '';

/**
 * @type {String}
 * IMPORTANT: Change to your local dev ip address
 * @properties={typeid:35,uuid:"81975EEC-A244-4E28-AC77-20E9D9872987"}
 */
var devURL = '';

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
	} else {
		//try to get local IP address instead of using localhost
		var s = new java.net.Socket('google.com', 80);
		devURL = s.getLocalAddress().getHostAddress();

		//update local rest endpoint
		servoyMGMServer = 'http://' + devURL + ':' + application.getServerURL().split(':')[2] + 'servoy-service/rest_ws/ws/mgm'
	}
	application.output(devURL)
	plugins.ngclientutils.setViewportMetaForMobileAwareSites(plugins.ngclientutils.VIEWPORT_MOBILE_DEFAULT)
}

/**
 * @param {JSRecord<db:/onlyoffice/files>} record
 * @properties={typeid:24,uuid:"09D2CF0D-5B60-4355-B61A-EC724D838248"}
 */
function getRemoteUrl(record) {
	var remoteFileName = record.file_sname;
	var bytes = record.file_data;
	var file = plugins.file.createFile(plugins.file.getDefaultUploadLocation() + '/' + remoteFileName);
	if (!file.exists()) {
		file.createNewFile();
		file.setBytes(bytes);
	}

	var remoteFile = plugins.file.convertToRemoteJSFile('/' + remoteFileName);
	remoteFile.setBytes(bytes, true);
	var remoteUrl = plugins.file.getUrlForRemoteFile('/' + remoteFileName);
	if (application.isInDeveloper()) {
		remoteUrl = remoteUrl.replace('localhost', devURL);
	}
	return {
		url: remoteUrl,
		name: remoteFileName
	}
}

/**
 * Convert from one document type to another.
 * https://api.onlyoffice.com/editors/conversionapi#async
 * @properties={typeid:24,uuid:"369E8DF8-94FA-4774-AD55-AD1D4B3F3932"}
 */
function convert(file_type, outputtype, key, title, url) {
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
