import {PluginBundleApi, Registries} from "@veyes/core";
import {BuiltInApiGroup} from "@veyes/models";
import {UserController, UserAuthMiddleware} from "./api";

const registries = new Registries();

registries.forType(BuiltInApiGroup.controllerV1).register(UserController, "auth/v1")
registries.forType(BuiltInApiGroup.middlewareV1).register(UserAuthMiddleware, "")
export default new PluginBundleApi(registries);