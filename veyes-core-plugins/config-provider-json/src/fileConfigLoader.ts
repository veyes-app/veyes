import fs from "fs";
import {ConfigLoader, ServerConfig} from "@veyes/models";

export abstract class FileConfigLoader implements ConfigLoader {

    protected constructor() {
    }

    abstract parseFile(data: string | Buffer): ServerConfig

    getConfiguration(source: URL, currentServerConfig?: Record<string, any>): ServerConfig {
        if (!source.pathname) {
            throw new Error("A path to a file must be defined")
        }

        return this.parseFile(fs.readFileSync(source.pathname, {encoding: "utf8"}))
    }

    abstract canHandle(source: URL): boolean ;

    getPriority(): number {
        return 10;
    }
}
