import {DatasourcePlugin, PluginBundleApi} from '@veyes/core'
import {
    BaseQuery,
    DatasourceApi,
    DatasourcePluginConfig,
    DataSourcePluginOptionsEditorProps,
    QueryEditorProps
} from '@veyes/models';

interface MyConfig extends DatasourcePluginConfig {

}

interface MyQuery extends BaseQuery {

}

const BasicConfig = ({}: DataSourcePluginOptionsEditorProps) => {

}
const QueryBuilder = ({}: QueryEditorProps<DS, MyQuery, MyConfig>) => {

}

class DS implements DatasourceApi<MyQuery, MyConfig> {
    constructor(private config: MyConfig) {
    }

    query(query: MyQuery) {

    }
}

export const pluginBundle = new PluginBundleApi()
    .registerDatasource(
        new DatasourcePlugin<DS, MyQuery, MyConfig>(DS, "this-id")
            .registerConfigurationPage(BasicConfig)
            .registerQueryBuilder(QueryBuilder)
    )
