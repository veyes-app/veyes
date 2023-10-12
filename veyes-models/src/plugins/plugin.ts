import {PanelPluginApi} from "./panel";
import {ContextProviderPlugin} from './contextProvider'
import {DatasourcePluginApi} from "./datasource";
import {TransformationPlugin} from "./transformation";
import {ValueFormatterPlugin} from "./valueFormatter";

export interface Plugin {

}

export interface PluginDescriptor {
    name: string
    id: string
    signature?: string
}

export interface PluginBundle {
    registerPanel(panelPlugin: PanelPluginApi): PluginBundle

    registerDatasource(datasource: DatasourcePluginApi<any>): PluginBundle

    registerTransformation(transformationPlugin: TransformationPlugin): PluginBundle

    registerValueFormatter(formatter: ValueFormatterPlugin): PluginBundle

    registerContextProvider(contextProvider: ContextProviderPlugin): PluginBundle
}

