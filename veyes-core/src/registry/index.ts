import {RegistriesIf, RegistryIf} from "@veyes/models";

export class Registries implements RegistriesIf {

    private readonly registries: Record<string, Registry<any>>

    constructor() {
        this.registries = {}
    }

    register(name: string, registry: Registry<any>) {
        if (this.registries[name]) {
            throw new Error('Could not register an already existing registry')
        }
        this.registries[name] = registry
    }

    forType<T>(name: string): Registry<T> {
        if (!this.registries[name]) {
            this.register(name, new Registry<T>())
        }
        return this.getRegistry<T>(name);
    }

    getRegistry<T>(name: string): Registry<T> | undefined {
        return this.registries[name]
    }

}

export class Registry<T> implements RegistryIf<T> {
    private items: Record<string, T>

    constructor() {
        this.items = {}
    }

    register(element: T, name = element.constructor.name) {
        this.items[name] = element
    }

    get(name: string) {
        return this.items[name]
    }

    remove(name: string) {
        delete this.items[name]
    }

    list() {
        return Object.entries(this.items)
    }
}