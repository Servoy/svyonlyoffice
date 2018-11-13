/**
 * @type {String}
 * @public
 * @properties={typeid:35,uuid:"93CD81B5-E486-45AF-A3BB-68DC2DAB9736"}
 */
var user_name = '';

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"D1590203-544B-49F5-B060-0A4D04DFC47E"}
 */
var dp;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"3E613C35-B44E-4822-8DEC-D6353DB8C261"}
 */
var dp_filename

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"307895B0-D1D9-428A-AAA4-7A75141F2207"}
 */
var dp_mimetype;
/**
 * @param oldValue
 * @param newValue
 * @param {JSEvent} event
 *
 * @return {boolean}
 *
 * @protected

 *
 * @properties={typeid:24,uuid:"BEFF0E57-2298-4AC1-8569-06AF111C819E"}
 */
function onDataChange(oldValue, newValue, event) {
	var fs = datasources.db.onlyoffice.files.getFoundSet();
	fs.newRecord();
	fs.file_id = application.getUUID();
	fs.file_sname = utils.stringReplace(application.getUUID().toString(), '-', '') + '.' + dp_filename.split('.')[1]
	fs.file_name = dp_filename;
	fs.file_type = dp_mimetype;
	fs.file_data = newValue;
	databaseManager.saveData(fs);
	return false;
}

/**
 * @param mime_type
 * @protected
 *
 * @properties={typeid:24,uuid:"251E7B0E-6DF4-445F-9E31-5E1BC85F0FAB"}
 */
function getDocFileType(mime_type) {
	var doc_type;
	switch (mime_type) {
	case 'text/csv':
		doc_type = 'csv';
		break;
	case 'application/pdf':
		doc_type = 'pdf';
		break;
	case 'text/plain':
		doc_type = 'txt';
		break;
	}

	return doc_type;
}

/**
 * @protected
 *
 * @param f_type
 *
 * @properties={typeid:24,uuid:"7BF7FA3F-1408-4655-86A3-A9CEBF68854F"}
 */
function getDocType(f_type) {
	var doc_type;
	switch (f_type) {
	case 'text/plain':
		doc_type = 'text';
		break;
	case 'application/pdf':
		doc_type = 'text';
		break;
	case 'dotx':
		doc_type = 'text';
		break;
	case 'docx':
		doc_type = 'text';
		break;
	case 'odt':
		doc_type = 'text';
		break;
	case 'application/msword':
		doc_type = 'text';
		break;
	case 'application/vnd.oasis.opendocument.text':
		doc_type = 'text';
		break;
	case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
		doc_type = 'text';
		break;
	case 'application/vnd.openxmlformats-officedocument.wordprocessingml.template':
		doc_type = 'text';
		break;
	case 'pptx':
		doc_type = 'presentation';
		break;
	case 'ppt':
		doc_type = 'presentation';
		break;
	case 'application/vnd.ms-powerpoint':
		doc_type = 'presentation';
		break;
	case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
		doc_type = 'presentation';
		break;
	case 'xlsx':
		doc_type = 'spreadsheet';
		break;
	case 'application/vnd.ms-excel':
		doc_type = 'spreadsheet';
		break;
	case 'application/vnd.oasis.opendocument.spreadsheet':
		doc_type = 'spreadsheet';
		break;
	case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
		doc_type = 'spreadsheet';
		break;
	case 'text/csv':
		doc_type = 'spreadsheet';
		break;
	default:
		doc_type = 'not_supported';
		break;
	}
	return doc_type;
}

/**
 * Called when the mouse is double clicked on a row/cell (foundset and column indexes are given).
 *
 * @param {Number} foundsetindex
 * @param {Number} [columnindex]
 * @param {JSRecord<db:/onlyoffice/files>} [record]
 * @param {JSEvent} [event]
 * @AllowToRunInFind
 *
 * @properties={typeid:24,uuid:"D35BD1E9-F458-41BD-AE5A-3AC85D6B02F8"}
 */
function openFile(foundsetindex, columnindex, record, event) {
	if (!record) return null;
	//Create a real link to file and get a remote URL
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
	elements.title.text = record.file_name;
	hideFileManager();
	return forms.editor.load(remoteFileName, remoteUrl, getDocType(record.file_type), getDocFileType(record.file_type), record.file_key);
}

/**
 * @properties={typeid:24,uuid:"3A50049E-FA3F-42F6-99D8-4B18FE32E3F2"}
 */
function hideFileManager() {
	elements.fm.visible = false;
	elements.upload.visible = false;
	elements.close.visible = true;
}

/**
 * @properties={typeid:24,uuid:"1049B2AA-2266-407B-A43A-F7692FD1A8E2"}
 */
function showFileManager() {
	elements.title.text = 'MY FILES';
	elements.fm.visible = true;
	elements.upload.visible = true;
	elements.close.visible = false;
}

/**
 * @param {Boolean} firstShow
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"7C943858-E89D-4345-AD8E-BA90F1FAC9A5"}
 */
function onShow(firstShow, event) {
	user_name = plugins.dialogs.showInputDialog('Enter Username');
	elements.title.text = 'MY FILES';
	showFileManager();
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"24D12D1E-5C03-4070-9C5D-C18AFA4D1425"}
 */
function hideEditor(event) {
	forms.editor.hideEditor();
	showFileManager();
}

/**
 * Called when the mouse is clicked on a row/cell (foundset and column indexes are given) or.
 * when the ENTER key is used then only the selected foundset index is given
 * Use the record to exactly match where the user clicked on
 *
 * @param {Number} foundsetindex
 * @param {Number} [columnindex]
 * @param {JSRecord<db:/onlyoffice/files>} [record]
 * @param {JSEvent} [event]
 *
 * @private
 *
 * @properties={typeid:24,uuid:"1E926CF2-4115-4E50-9CD4-EC06EB8889EA"}
 */
function onCellClick(foundsetindex, columnindex, record, event) {
	if (columnindex == 0) {
		openFile(foundsetindex, columnindex, record, event);
	}
	if (columnindex == 1) {
		var out = plugins.dialogs.showSelectDialog('INFO', 'Select File Output', getConvertOutOptions(record.file_name.split('.')[1]))
		if (out) {
			plugins.svyBlockUI.spinner = 'Chasing dots';
			plugins.svyBlockUI.show('Converting...')
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
			scopes.onlyoffice.convert(record.file_name.split('.')[1], out, record.file_key, record.file_name, remoteUrl);
		}
	}
	if (columnindex == 2) {
		foundset.deleteRecord(record);
	}

}

/**
 * @param input
 *
 * @properties={typeid:24,uuid:"E678ED61-87E9-4F0E-A50C-94848F225677"}
 */
function getConvertOutOptions(input) {
	switch (input) {
	case 'doc':
		return ['bmp', 'docx', 'gif', 'jpg', 'odt', 'pdf', 'png', 'rtf', 'txt']
		break;
	case 'docx':
		return ['bmp', 'gif', 'jpg', 'odt', 'pdf', 'png', 'rtf', 'txt']
		break;
	case 'txt':
		return ['bmp', 'gif', 'jpg', 'odt', 'pdf', 'png', 'rtf', 'docx']
		break;
	case 'csv':
		return ['bmp', 'jpg', 'gif', 'pdf', 'png', 'ods', 'xlsx']
		break;
	default:
		break;
	}
	return [];
}
