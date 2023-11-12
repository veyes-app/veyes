import {PluginBundleApi, Registries} from "@veyes/core";
import {BuiltInApiGroup} from "@veyes/models";
import {DatasourceController} from "./api";

const registries = new Registries();
registries.forType(BuiltInApiGroup.controllerV1).register(DatasourceController, "datasource/v1")
export default new PluginBundleApi(registries);