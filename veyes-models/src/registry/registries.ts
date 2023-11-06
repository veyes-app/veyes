import {RegistryIf} from "./registry";

export interface RegistriesIf {
    register(name: string, registry: RegistryIf<any>): void;

    forType<T>(name: string): RegistryIf<T>;

    getRegistry<T>(name: string): RegistryIf<T> | undefined;
}
