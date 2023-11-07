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
import {PluginBundle} from "@veyes/models";
import {Registries} from "../registry";

export class PluginBundleApi extends Registries implements PluginBundle {
    private apiGroup: string;

    constructor(apiGroup: string) {
        super()
        this.apiGroup = apiGroup
    }

}