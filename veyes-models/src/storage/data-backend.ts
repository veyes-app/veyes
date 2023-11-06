import {StorageObject, StorageReference} from "./types";

export interface NewDataBackendAPI {
    new(connectionString: URL)
}

export interface DataBackendAPI {
    putObject(obj: StorageObject<unknown>): Promise<void>

    deleteObject(obj: StorageObject<unknown> | StorageReference): Promise<void>

    getObject(ref: StorageReference): Promise<StorageObject<unknown>>

    supportedScheme(): string[]
}