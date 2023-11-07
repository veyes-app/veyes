import {PluginBundleApi} from "@veyes/core";
import {KnownRegistryTypes} from "@veyes/models";
import {SqliteBackend} from "./backend";

export const pluginBundle = new PluginBundleApi("storage/v1")
    .forType(KnownRegistryTypes.DataBackendProvider)
    .register(SqliteBackend, "sqlite")