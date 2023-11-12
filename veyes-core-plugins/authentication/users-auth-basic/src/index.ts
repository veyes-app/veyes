import {PluginBundleApi, Registries} from "@veyes/core";
const registries = new Registries();

// registries.forType(BuiltInApiGroup.controllerV1).register(UserController, "auth/v1")
// registries.forType(BuiltInApiGroup.middlewareV1).register(UserAuthMiddleware, "")
export default new PluginBundleApi(registries);