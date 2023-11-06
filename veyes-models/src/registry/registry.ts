export interface RegistryIf<T> {
    register(element: T, name: string): void;

    get(name: string): any;

    remove(name: string): void;

    list(): [string, unknown][];
}