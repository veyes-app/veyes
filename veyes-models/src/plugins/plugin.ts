export interface Plugin {

}

export interface PluginDescriptor {
    name: string
    id: string
    signature?: string
}

export interface PluginBundle {

    // registerPanel(panelPlugin: PanelPluginApi): PluginBundle
    //
    // registerDatasource(datasource: DatasourcePluginApi<any>): PluginBundle
    //
    // registerTransformation(transformationPlugin: TransformationPlugin): PluginBundle
    //
    // registerValueFormatter(formatter: ValueFormatterPlugin): PluginBundle
    //
    // registerContextProvider(contextProvider: ContextProviderPlugin): PluginBundle
}

