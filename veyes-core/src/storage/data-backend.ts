import {EventEmitter} from 'events';
import {DataBackendAPI, StorageObject, StorageReference} from '@veyes/models'

export enum DataBackendEvent {
    OBJECT_PUT = 'data-backend.object.put',
    OBJECT_DELETE = 'data-backend.object.delete'
}

interface DataBackendPrivateAPI {
    write(obj: StorageObject<unknown>): Promise<void>

    remove(obj: StorageObject<unknown>): Promise<void>

    read(ref: StorageReference): Promise<StorageObject<unknown>>
}

export abstract class AbstractDataBackend extends EventEmitter implements DataBackendAPI, DataBackendPrivateAPI {

    protected constructor() {
        super();
    }

    protected validateReference(ref?: Partial<StorageReference>, thr = false): boolean {
        const validate = ref && !!ref.name && !!ref.kind && !!ref.apiVersion
        if (!validate && thr) {
            throw new Error(`Invalid Reference; Received ${ref}`)
        }
        return validate
    }

    async getObject(ref: StorageReference): Promise<StorageObject<unknown>> {
        this.validateReference(ref, true)
        return this.read(ref)
    }

    async putObject(obj: StorageObject<unknown>): Promise<void> {
        this.validateReference(obj, true)
        await this.write(obj)
        this.emit(DataBackendEvent.OBJECT_PUT, obj)
    }

    async deleteObject(obj: StorageObject<unknown> | StorageReference): Promise<void> {
        this.validateReference(obj, true)
        await this.remove(obj)
        this.emit(DataBackendEvent.OBJECT_DELETE, obj)
    }

    close(): void {
        this.removeAllListeners()
    }

    /** Data-backends must overwrite these ! **/
    abstract read(ref: StorageReference): Promise<StorageObject<unknown>>;

    abstract remove(obj: StorageObject<unknown> | StorageReference): Promise<void>;

    abstract write(obj: StorageObject<unknown>): Promise<void>;

    abstract supportedScheme(): string[];
}