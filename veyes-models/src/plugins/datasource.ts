import {ComponentType} from 'react';

import {Plugin} from "./plugin";
import {BaseQuery} from "../query";

export interface DatasourcePluginConfig {

}

// Only exported for tests
export interface DataSourceConstructor<
    DSType extends DatasourceApi<TQuery, TOptions>,
    TQuery extends BaseQuery = BaseQuery,
    TOptions extends DatasourcePluginConfig = DatasourcePluginConfig,
> {
    new(instanceSettings: TOptions): DSType;
}

export interface DatasourceApi<
    TQuery extends BaseQuery = BaseQuery,
    TOptions extends DatasourcePluginConfig = DatasourcePluginConfig,
> {
    query(query: TQuery)
}

export interface DataSourcePluginOptionsEditorProps<
    JSONData extends DatasourcePluginConfig = DatasourcePluginConfig,
> {
    options: JSONData;
    onOptionsChange: (options: JSONData) => void;
}

export interface QueryEditorProps<
    DSType extends DatasourceApi<TQuery, TOptions>,
    TQuery extends BaseQuery = BaseQuery,
    TOptions extends DatasourcePluginConfig = DatasourcePluginConfig,
> {
    datasource: DSType;
    query: TQuery;
    onRunQuery: () => void;
    onChange: (value: TQuery) => void;
    onBlur?: () => void;
    onAddQuery?: (query: TQuery) => void;

    /**
     * Contains query response filtered by refId of QueryResultBase and possible query error
     */
    // data?: PanelData;
    // range?: TimeRange;
    // queries?: TQuery[];
}

// Utility type to extract the query type TQuery from a class extending DataSourceApi<TQuery, TOptions>
export type DataSourceQueryType<DSType> = DSType extends DatasourceApi<infer TQuery, any> ? TQuery : never;

// Utility type to extract the options type TOptions from a class extending DataSourceApi<TQuery, TOptions>
export type DataSourceOptionsType<DSType> = DSType extends DatasourceApi<any, infer TOptions> ? TOptions : never;

export interface DatasourcePluginApi<
    DSType extends DatasourceApi<TQuery, TOptions>,
    TQuery extends BaseQuery = DataSourceQueryType<DSType>,
    TOptions extends DatasourcePluginConfig = DataSourceOptionsType<DSType>
> extends Plugin {
    registerConfigurationPage(component: ComponentType<DataSourcePluginOptionsEditorProps<TOptions>>)

    registerQueryBuilder(component: ComponentType<QueryEditorProps<DSType, TQuery, TOptions>>)
}