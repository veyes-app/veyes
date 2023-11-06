import * as fs from 'fs'
import {SqliteBackend} from "./backend";
import Database from "better-sqlite3";

describe('SQLite3 Backend tests', () => {

    it('should return the right list of supported scheme', () => {

    });

    it('should create a database', () => {
        const tmpDir = fs.mkdtempSync("veyes-tests-")
        const config: URL = new URL("sqlite://db.sqlite")

        const backend = new SqliteBackend(config)
        backend.close()

        const db = new Database(config.pathname)
        const listTables = `SELECT name FROM sqlite_schema WHERE type ='table' AND name='veyes-data';`
        const res = db.prepare(listTables).get()

        expect(res).toEqual({name: "veyes-data"})
        db.close()
        fs.rmSync(tmpDir, {recursive: true})
    });

    it('should be able to write and object', () => {
        const tmpDir = fs.mkdtempSync("veyes-tests-")
        const config: URL = new URL("sqlite://db.sqlite")


        const backend = new SqliteBackend(config)
        const source = {name: "test", apiVersion: "group/v1", kind: "dummy", value: {field: "value"}}
        const expected = {name: "test", apiVersion: "group/v1", kind: "dummy", value: '{"field":"value"}'}
        backend.putObject(source)
        backend.close()

        const db = new Database(config.pathname)
        const selectData = `SELECT * FROM "veyes-data";`
        const res = db.prepare(selectData).all()
        expect(res.length).toBe(1)
        expect(res[0]).toEqual(expected)
        db.close()
        fs.rmSync(tmpDir, {recursive: true})
    });

    it('should be able get an object', () => {
        const tmpDir = fs.mkdtempSync("veyes-tests-")
        const config: URL = new URL("sqlite://db.sqlite")

        const backend = new SqliteBackend(config)
        const source = {name: "test", apiVersion: "group/v1", kind: "dummy", value: {field: "value"}}
        backend.putObject(source)
        const valueFromDb = backend.getObject(source)
        backend.close()

        expect(valueFromDb).toEqual(source)
        fs.rmSync(tmpDir, {recursive: true})
    });

    it('should return null if reference not found', () => {
        const tmpDir = fs.mkdtempSync("veyes-tests-")
        const config: URL = new URL("sqlite://db.sqlite")

        const backend = new SqliteBackend(config)
        const obj = backend.getObject({name: "dummy", kind: "dummy", apiVersion: "dummy"})
        backend.close()

        expect(obj).toBeNull()
        fs.rmSync(tmpDir, {recursive: true})

    });
});