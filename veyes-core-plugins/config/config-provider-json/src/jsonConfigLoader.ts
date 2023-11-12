import {FileConfigLoader} from "./fileConfigLoader";
import Path from "path";
import fs from "fs";
import {ServerConfig} from "@veyes/models";

export class JsonConfigLoader extends FileConfigLoader {
    constructor() {
        super();
    }

    parseFile(data: string | Buffer): ServerConfig {
        return JSON.parse(typeof data === "string" ? data : data.toString())
    }

    canHandle(source: URL): boolean {
        if (source.protocol === 'json:') {
            return fs.existsSync(Path.resolve(source.pathname));
        }else {
            return false
        }

    }
}
