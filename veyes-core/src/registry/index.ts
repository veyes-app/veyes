import {RegistriesIf, RegistryIf} from "@veyes/models";

export class Registries implements RegistriesIf {

    private readonly registries: Record<string, Registry<any>>

    constructor() {
        this.registries = {}
    }

    public validateApiGroup(apiGroup: string) {
        if (!apiGroup.match(/^[a-z]+\/v[0-9]+$/)) {
            throw new Error("Given API Group is Invalid")
        }
    }

    register(name: string, registry: Registry<any>) {
        this.validateApiGroup(name);
        if (this.registries[name]) {
            throw new Error('Could not register an already existing registry')
        }
        this.registries[name] = registry
    }

    forType<T>(name: string): Registry<T> {
        this.validateApiGroup(name);
        if (!this.registries[name]) {
            this.register(name, new Registry<T>())
        }
        return this.getRegistry<T>(name);
    }

    getRegistry<T>(name: string): Registry<T> | undefined {
        return this.registries[name]
    }

    types() {
        return Object.keys(this.registries)
    }

}

export class Registry<T> implements RegistryIf<T> {
    private readonly items: Record<string, T>

    constructor() {
        this.items = {}
    }

    register(element: T, name = element.constructor.name): RegistryIf<T> {
        if (!this.items[name]) {
            this.items[name] = element
            return this;
        }
        throw new Error(`${name} is already registered with another value; To replace, first remove then register`)
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