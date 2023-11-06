import {FileConfigLoader} from "./fileConfigLoader";
import fs from "fs";
import Path from "path";
import {ServerConfig} from "@veyes/models";
import YAML from 'yaml'

export class YamlConfigLoader extends FileConfigLoader {

    constructor() {
        super();
    }

    parseFile(data: string | Buffer): ServerConfig {
        return YAML.parse(typeof data === "string" ? data : data.toString());
    }

    canHandle(source: URL): boolean {
        if (source.protocol !== 'yaml:') {
            return false
        }
        return fs.existsSync(Path.resolve(source.pathname));
    }
}