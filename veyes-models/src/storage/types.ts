export interface StorageReference {
    apiVersion: string
    kind: string
    name: string
}

export interface StorageObject<T> extends StorageReference {
    value: T
}