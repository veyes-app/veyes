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

export class PluginBundleApi implements PluginBundle {
    private readonly registries: Registries;
    constructor(registries: Registries) {
        this.registries = registries;
    }

    getRegistries(): Registries{
        return this.registries;
    }



}