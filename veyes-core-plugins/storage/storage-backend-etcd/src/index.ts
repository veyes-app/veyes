import {PluginBundleApi, Registries} from "@veyes/core";
import {BuiltInApiGroup} from "@veyes/models";
import {EtcdBackend} from "./backend";

const registries = new Registries();
registries.forType(BuiltInApiGroup.storageV1).register(EtcdBackend, "etcd")
export default new PluginBundleApi(registries);

