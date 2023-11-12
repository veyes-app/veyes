import {PluginBundleApi, Registries} from "@veyes/core";

const registries = new Registries();

// registries.forType(BuiltInApiGroup.controllerV1).register(AnnotationController, "annotation/v1")
export default new PluginBundleApi(registries);