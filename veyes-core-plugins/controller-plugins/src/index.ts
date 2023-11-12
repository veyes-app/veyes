import {PluginBundleApi, Registries} from "@veyes/core";
import {BuiltInApiGroup} from "@veyes/models";
import {PluginController} from "./controller";

const registries = new Registries();
registries.forType(BuiltInApiGroup.controllerV1).register(PluginController, "plugin/v1")
export default new PluginBundleApi(registries);