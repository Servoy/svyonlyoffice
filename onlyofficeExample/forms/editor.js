/**
 * @properties={typeid:24,uuid:"FBEAE4D3-4CE0-4230-A690-5B01166F7A50"}
 * @AllowToRunInFind
 * @SuppressWarnings(wrongparameters)
 */
function cbOnLoad(data) {
	//when record is loaded, check to see if it exists
	//file key is updated when document is loaded.  Update document record in database with new key.
	var fs = datasources.db.onlyoffice.files.getFoundSet();
	fs.find();
	fs.file_sname = data.document.info.title;
	fs.search();
	if (fs.getSelectedRecord()) {
		if (data.document.key) {
			fs.file_key = data.document.key;
		}
	}
	databaseManager.saveData();
}

/**
 * @param remoteFileName
 * @param remoteUrl
 * @param doc_type
 * @param doc_file_type
 * @param [key]
 * @properties={typeid:24,uuid:"E6BF42E8-AAB8-4C3D-890E-2AFC242155E8"}
 */
function load(remoteFileName, remoteUrl, doc_type, doc_file_type, key) {
	//		application.output(remoteFileName)
	//		application.output(remoteUrl)
	//		application.output(doc_type)
	//		application.output(doc_file_type)
	if (doc_type == 'not_supported') {
		return plugins.dialogs.showInfoDialog('INFO', 'File type not supported.')
	}

	var cb_url = scopes.onlyoffice.servoyMGMServer;
	elements.editor.destroy(); //if there's a document open, first close it.

	//then load the document
	elements.editor.load({
			"document": {
				"fileType": doc_file_type,
				"key": key,
				"title": " ",
				"url": remoteUrl,
				info: {
					title: remoteFileName
				}
			},
			"height": "100%",
			"documentType": doc_type,
			"editorConfig": {
				"user": { //who opened the document
					"id": application.getUUID().toString(),
					"name": forms.demo.user_name
				},
				"callbackUrl": cb_url,
				mode: 'edit',
				"customization": {
					"autosave": true,
					"chat": false,
					"commentAuthorOnly": false,
					"toolbar": true,
					"header": false,
					"compactToolbar": true,
					"comments": false,
					"customer": {
						"address": "",
						"info": "",
						"logo": "",
						"mail": "",
						"name": "",
						"www": ""
					},
					"feedback": {
						"visible": false
					},
					"forcesave": false,
					"goback": {
						visible: false
					},
					"logo": {
						"image": '',
						"imageEmbedded": '',
						"url": ""
					},
					"showReviewChanges": false,
					"zoom": 100
				}
			}
		}, cbOnLoad);
	return null;
}
/**
 * Callback method when form is (re)loaded.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"5E42FB8A-4CED-4445-8D0A-AC9679DF0B19"}
 */
function onLoad(event) {
	//initialize editor
	elements.editor.init(scopes.onlyoffice.docServerJS);
	elements.editor.destroy();
}

/**
 * @public
 * @properties={typeid:24,uuid:"76BD4D6B-77E5-42C0-9B8D-B049497E01A0"}
 */
function hideEditor() {
	elements.editor.destroy();
}

/**
 * Callback method for when form is shown.
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"48F3E250-DBB8-438A-BA77-D5B257ECCD06"}
 */
function onShow(firstShow, event) {
	elements.editor.destroy();
}
