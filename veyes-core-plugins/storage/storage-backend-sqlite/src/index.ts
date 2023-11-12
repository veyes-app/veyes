import {PluginBundleApi, Registries} from "@veyes/core";
import {BuiltInApiGroup} from "@veyes/models";
import {SqliteBackend} from "./backend";

const registries = new Registries();
registries.forType(BuiltInApiGroup.storageV1).register(SqliteBackend, "sqlite")
export default new PluginBundleApi(registries);