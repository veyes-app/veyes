import {ServerConfig} from "@veyes/models";

export const defaultConfig: Partial<ServerConfig> = {
    host: "0.0.0.0",
    port: 3536,
    config: ["cli://"],
    pluginsDirectories: [],
    apiPrefix: '/api/'
}