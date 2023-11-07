export interface RegistryIf<T> {
    register(element: T, name: string): RegistryIf<T>;

    get(name: string): any;

    remove(name: string): void;

    list(): [string, unknown][];
}