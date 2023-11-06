// import {
//     BaseQuery,
//     DatasourceApi,
//     DataSourceConstructor,
//     DataSourcePluginApi,
//     DatasourcePluginConfig, DataSourcePluginOptionsEditorProps, QueryEditorProps
// } from "@veyes/models";
// import React from "react";
//
// export class DatasourcePlugin<
//     Datasource extends DatasourceApi<Query, Config>,
//     Query extends BaseQuery = BaseQuery,
//     Config extends DatasourcePluginConfig = DatasourcePluginConfig
// > implements DataSourcePluginApi<Datasource, Query, Config> {
//
//     constructor(private DataSourceClass: DataSourceConstructor<Datasource, Query, Config>, private id: string = "datasource") {
//
//     }
//
//     registerConfigurationPage(component: React.ComponentType<DataSourcePluginOptionsEditorProps<Config>>) {
//         return this;
//     }
//
//     registerQueryBuilder(component: React.ComponentType<QueryEditorProps<Datasource, Query, Config>>) {
//         return this;
//     }
//
//
// }