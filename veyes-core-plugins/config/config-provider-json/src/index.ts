import {BuiltInApiGroup} from "@veyes/models";
import {JsonConfigLoader} from "./jsonConfigLoader";
import {YamlConfigLoader} from "./yamlConfigLoader";
import {PluginBundleApi, Registries} from "@veyes/core";

const registries = new Registries();
registries.forType(BuiltInApiGroup.configurationV1)
    .register(JsonConfigLoader, "json")
    .register(YamlConfigLoader, "yaml")
export default new PluginBundleApi(registries);