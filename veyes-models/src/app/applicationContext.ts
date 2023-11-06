import {DataBackendAPI} from "../storage";
import {RegistriesIf} from "../registry";
import {PluginLoaderIf} from "../plugins";

export interface ApplicationContext {
    dataBackend: DataBackendAPI
    registries: RegistriesIf
    pluginLoader: PluginLoaderIf
    runtimeConfig: Record<string, any>
}