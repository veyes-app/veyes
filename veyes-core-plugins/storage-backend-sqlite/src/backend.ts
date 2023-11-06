import {SqliteBackendConfig} from "./types";
import Database from "better-sqlite3";
import {AbstractDataBackend, urlParamsAsObject} from "@veyes/core";
import {StorageObject, StorageReference} from "@veyes/models";

type SQLiteStorageObject = StorageObject<string>

const createTableSQL: string = `
CREATE TABLE IF NOT EXISTS "veyes-data" (
apiVersion TEXT,kind TEXT,name TEXT,value TEXT,

CONSTRAINT veyes_data_PK PRIMARY KEY (apiVersion,kind,name),
CONSTRAINT veyes_data_UN UNIQUE (apiVersion,kind,name)

);
CREATE UNIQUE INDEX veyes_data_apiVersion_IDX ON "veyes-data" (apiVersion,kind,name);
`

const putDataSQL: string = `INSERT OR REPLACE into "veyes-data" (apiVersion, kind, name, value) values (@apiVersion, @kind, @name, @value);`

const getDataSQL: string = `SELECT * FROM "veyes-data" WHERE apiVersion=@apiVersion and kind=@kind and name=@name;`
const deleteDataSQL: string = `DELETE FROM "veyes-data" WHERE apiVersion=@apiVersion and kind=@kind and name=@name;`

export class SqliteBackend extends AbstractDataBackend {

    private database: Database.Database;

    constructor(url: URL) {
        super();
        const config = urlParamsAsObject<SqliteBackendConfig>(url.searchParams)
        this.database = new Database(config.file, config.options)
        this.database.exec(createTableSQL)
    }

    private convertToSQLiteStorageObject(value: StorageObject<unknown>): SQLiteStorageObject {
        return {
            name: value.name,
            kind: value.kind,
            apiVersion: value.apiVersion,
            value: JSON.stringify(value.value)
        }
    }

    private convertToStorageObject(value?: SQLiteStorageObject): StorageObject<unknown> | null {
        if (!value) {
            return null
        }
        return {
            name: value.name,
            kind: value.kind,
            apiVersion: value.apiVersion,
            value: JSON.parse(value.value)
        }
    }

    private convertToStrictReference(obj: StorageReference): StorageReference {
        return {name: obj.name, kind: obj.kind, apiVersion: obj.apiVersion}
    }

    read(ref: StorageReference): Promise<StorageObject<unknown>> {
        return Promise.resolve(this.convertToStorageObject(this.database.prepare(getDataSQL).get(this.convertToStrictReference(ref)) as SQLiteStorageObject))
    }

    write(obj: StorageObject<unknown>): Promise<void> {
        this.database.prepare(putDataSQL).run(this.convertToSQLiteStorageObject(obj))
        return
    }

    remove(obj: StorageObject<unknown>): Promise<void> {
        this.database.prepare(deleteDataSQL).run(this.convertToStrictReference(obj))
        return
    }

    close(): void {
        super.close()
        this.database.close()
    }

    supportedScheme(): string[] {
        return ["sqlite:"];
    }
}