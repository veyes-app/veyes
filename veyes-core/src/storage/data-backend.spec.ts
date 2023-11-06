import {AbstractDataBackend, DataBackendEvent} from "./data-backend";
import {StorageObject, StorageReference} from "@veyes/models";

describe('Testing AbstractDataBackend', () => {

    class FakeBackend extends AbstractDataBackend {
        constructor() {
            super();
        }

        public validateReference(ref?: Partial<StorageReference>, thr: boolean = false): boolean {
            return super.validateReference(ref, thr);
        }

        remove(obj: StorageObject<unknown>): Promise<void> {
            return Promise.resolve()
        }

        read(ref: StorageReference): Promise<StorageObject<unknown>> {
            return Promise.resolve(undefined)
        }

        write(obj: StorageObject<unknown>): Promise<void> {
            return Promise.resolve()
        }

    }


    it('should not validate invalid reference correctly', () => {
        const fakeBackend = new FakeBackend();
        expect(() => fakeBackend.validateReference(undefined, true)).toThrow()
        expect(() => fakeBackend.validateReference({}, true)).toThrow()
        expect(() => fakeBackend.validateReference({name: "dummy", kind: "dummy"}, true)).toThrow()
        expect(() => fakeBackend.validateReference({apiVersion: "dummy", kind: "dummy"}, true)).toThrow()
        expect(() => fakeBackend.validateReference({apiVersion: "dummy", name: "dummy"}, true)).toThrow()
        expect(() => fakeBackend.validateReference({
            apiVersion: "dummy",
            kind: "dummy",
            name: "dummy"
        }, true)).not.toThrow()

        expect(fakeBackend.validateReference(undefined)).toBeFalsy()
        expect(fakeBackend.validateReference({})).toBeFalsy()
        expect(fakeBackend.validateReference({name: "dummy", kind: "dummy"})).toBeFalsy()
        expect(fakeBackend.validateReference({apiVersion: "dummy", kind: "dummy"})).toBeFalsy()
        expect(fakeBackend.validateReference({apiVersion: "dummy", name: "dummy"})).toBeFalsy()
        expect(() => fakeBackend.validateReference({apiVersion: "dummy", kind: "dummy", name: "dummy"})).toBeTruthy()


    });

    it('should send events when reference get written', () => {
        const fakeBackend = new FakeBackend();
        const callback = jest.fn()
        fakeBackend.on(DataBackendEvent.OBJECT_PUT, callback)
        const obj = {name: "dummy", kind: "dummy", apiVersion: "dummy", value: {}}
        fakeBackend.putObject({name: "dummy", kind: "dummy", apiVersion: "dummy", value: {}})

        expect(callback).toHaveBeenCalled()
        expect(callback).toHaveBeenCalledTimes(1)
        expect(callback).toHaveBeenNthCalledWith(1, obj)

    });

    it('should send events when reference get deleted', () => {
        const fakeBackend = new FakeBackend();
        const callback = jest.fn()
        fakeBackend.on(DataBackendEvent.OBJECT_DELETE, callback)
        const ref = {name: "dummy", kind: "dummy", apiVersion: "dummy"}
        fakeBackend.deleteObject(ref)

        expect(callback).toHaveBeenCalled()
        expect(callback).toHaveBeenCalledTimes(1)
        expect(callback).toHaveBeenNthCalledWith(1, ref)
    });

});