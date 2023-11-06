// import {
//     ContextProviderPlugin,
//     DatasourcePlugin, PanelConfiguration,
//     PanelPlugin,
//     PluginBundle,
//     // TransformationPlugin,
//     // ValueFormatterPlugin
// } from "@veyes/models"
//
//
// export class PluginBundleApi implements PluginBundle {
//
//     private datasourcePlugins: DatasourcePlugin[] = []
//     private panelPlugins: PanelPlugin<PanelConfiguration>[] = []
//
//     constructor() {
//
//     }
//
//     registerPanel(panelPlugin: PanelPlugin<PanelConfiguration>) {
//
//         return this;
//     }
//
//     registerDatasource(datasource: DatasourcePlugin) {
//         return this;
//     }
//
//     registerTransformation(transformationPlugin: TransformationPlugin) {
//         return this;
//     }
//
//     registerValueFormatter(formatter: ValueFormatterPlugin) {
//         return this;
//     }
//
//     registerContextProvider(contextProvider: ContextProviderPlugin) {
//         return this;
//     }
// }