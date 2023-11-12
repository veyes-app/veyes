import {PluginBundleApi, Registries} from "@veyes/core";
import {BuiltInApiGroup} from "@veyes/models";
import {RBACController} from "./api";

const registries = new Registries();

registries.forType(BuiltInApiGroup.controllerV1).register(RBACController, "rbac/v1")
registries.forType(BuiltInApiGroup.middlewareV1).register(RBACController, "")
export default new PluginBundleApi(registries);