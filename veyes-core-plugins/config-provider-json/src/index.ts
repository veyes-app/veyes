import {KnownRegistryTypes} from "@veyes/models";
import {JsonConfigLoader} from "./jsonConfigLoader";
import {YamlConfigLoader} from "./yamlConfigLoader";
import {PluginBundleApi} from "@veyes/core";

export const pluginBundle = new PluginBundleApi("configuration/v1")
    .forType(KnownRegistryTypes.ConfigProviders)
    .register(JsonConfigLoader, "json")
    .register(YamlConfigLoader, "yaml")