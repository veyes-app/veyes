import {ServerConfig} from "./config";

export interface ConfigLoader {
    getConfiguration(source: URL, currentServerConfig?: Record<string, any>): ServerConfig

    getPriority(): number

    canHandle(source: URL): boolean

}
