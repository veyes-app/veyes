import {PluginBundleApi, Registries} from "@veyes/core";
import {EnvConfigLoader} from "./envConfigLoader";
import {BuiltInApiGroup} from "@veyes/models";

const registries = new Registries();
registries.forType(BuiltInApiGroup.configurationV1).register(EnvConfigLoader, "env")
export default new PluginBundleApi(registries);