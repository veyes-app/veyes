import {PluginBundleApi} from "@veyes/core";
import {KnownRegistryTypes} from "@veyes/models";
import {EnvConfigLoader} from "./envConfigLoader";

export default new PluginBundleApi("configuration/v1")
    .forType(KnownRegistryTypes.ConfigProviders)
    .register(EnvConfigLoader, "env")