{
    "name": "svyonlyoffice-editor",
    "displayName": "editor",
    "version": 1,
    "definition": "svyonlyoffice/editor/editor.js",
    "serverscript": "svyonlyoffice/editor/server.js",
    "libraries": [],
    "model": {},
    "api": {
        "init": {"parameters": [{
            "name": "lib",
            "type": "string"
        }]},
        "load": {"parameters": [
            {
                "name": "properties",
                "type": "object"
            },
            {
                "name": "callback",
                "type": "function"
            }
        ]},
        "destroy": {"parameters": []}
    },
    "internalApi": 
	{
		"setData": 
		{
			"returns": "string",
			"parameters": 
			[
				{
					"name": "properties",
					"type": "object"
				},

				{
					"name": "callback",
					"type": "function"
				}
			]
		},

		"getData": 
		{
			"returns": "object"
		}
}
}