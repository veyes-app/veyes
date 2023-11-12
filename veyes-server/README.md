# Veyes API Server

```
* Hypothetical API
*
*  --------
*  Main API 
*  GET /apis => all apis from plugins
*  POST,DELETE /apis/<group>/<version>
*
*  WS /api/** => subscribe to events for a particular api / resource
*
*
* PLUGINS management plugin
*  GET /api/plugins/v1 => all plugins ?enabled=true
*  POST /api/plugins/v1 => install new plugin ?
*  GET,DELETE /api/plugins/v1/<plugin-uid> => get,delete (uninstall) plugins
* 
*  --------
* DATASOURCES management plugin
*  GET /api/datasource/v1/ => list available datasource (filters?)
*  POST /api/datasource/v1/ => new instance !
*  GET,DELETE,PUT /api/datasource/v1/<datasource-uid> => get,delete datasource config
*  *** /api/datasource/v1/<datasource-uid>/query => query the datasource => default is proxy; overloaded = custom impl
*
* DASHBOARDS management plugin
*  GET /api/dashboard/v1 => all db
*  GET,DELETE /api/dashboard/v1/<db-uid>/<version> => get,delete,update dashboard version
*  GET,PUT,DELETE /api/dashboard/v1/<db-uid>/ => get,delete,update dashboard
*
* FOLDERS management plugin
*  GET /api/folder/v1 => all folders (option: tree, flat, seatch ?)
*  POST /api/folder/v1 => create folder (can link to a parent)
*  POST /api/folder/v1/<folder-uid>/ => add content to folder (dashboard !!)
*  GET,DELETE,PUT /api/folder/v1/<folder-uid> => GET,DELETE,PUT(rename) folder content and info
*
* ANNOTATIONS plugin
* GET /api/annotation/v1 => all annotation providers
* POST /api/annotation/v1 => new provider instance
* GET,DELETE,PUT  /api/annotation/v1/<provider-uid> => GET,DELETE,Update provider config
*
* POST,GET /api/annotation/v1/<provider-uid>/annotation => Query/Create annotations
* GET,DELETE,PUT /api/annotation/v1/<provider-uid>/annotation/<annotation-uid> => get,update,delete one annotation
*
```