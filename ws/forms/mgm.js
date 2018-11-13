/**
 * When document is updated, call servoy endpoint to save/update data;
 * @properties={typeid:24,uuid:"69B2FDA9-D05D-424B-99C3-51CF5D7ACAD1"}
 * @AllowToRunInFind
 */
function ws_create() {
	var key = arguments[0].key;
	var url = arguments[0].url;
	//	application.output('key: ' + key);
	//	application.output('url: ' + url);
	if (key && url) {
		application.output('Get document changes and write back to database!')
		var fs = datasources.db.onlyoffice.files.getFoundSet();
		databaseManager.recalculate(fs);
		fs.find();
		fs.file_key = key;
		fs.search();
		var r = fs.getSelectedRecord();
		if (r) {
			r.file_key = application.getUUID().toString();
			r.file_data = plugins.http.getMediaData(url);
			databaseManager.saveData();
		}
	}
	return { error: 0 };
}

