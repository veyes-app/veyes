import {PluginBundleApi, Registries} from "@veyes/core";
import {BuiltInApiGroup} from "@veyes/models";
import {DashboardController, FolderController} from "./api";

const registries = new Registries();

registries.forType(BuiltInApiGroup.controllerV1).register(DashboardController, "dashboard/v1")
registries.forType(BuiltInApiGroup.controllerV1).register(FolderController, "folder/v1")
export default new PluginBundleApi(registries);