import {EtcdBackendConfig} from "./types";
import {Etcd3} from "etcd3";
import {AbstractDataBackend, urlParamsAsObject} from "@veyes/core";
import {StorageObject, StorageReference} from "@veyes/models";
import * as URL from "url";

export class EtcdBackend extends AbstractDataBackend {
    private etcd: Etcd3;

    constructor(connectionString: URL) {
        super();
        const config = urlParamsAsObject<EtcdBackendConfig>(connectionString.searchParams)
        this.etcd = new Etcd3()
    }

    private buildKey(ref: StorageReference) {
        return `${ref.apiVersion}/${ref.kind}/${ref.name}`
    }

    async remove(obj: StorageObject<unknown>): Promise<void> {
        await this.etcd.delete().key(this.buildKey(obj)).exec()
        return
    }

    async read(ref: StorageReference): Promise<StorageObject<unknown>> {
        return await (this.etcd.get(this.buildKey(ref)).json()) as Promise<StorageObject<unknown>>
    }

    async write(obj: StorageObject<unknown>): Promise<void> {
        await this.etcd.put(this.buildKey(obj)).value(JSON.stringify(obj)).exec()
        return;
    }

    supportedScheme(): string[] {
        return ["etcd:", "etcds:"];
    }

}