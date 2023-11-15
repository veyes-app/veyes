import {PluginLoaderConfig} from "../plugins";

export type RuntimeConfig = WebAppConfig | ServerConfig

export interface WebAppConfig {

}


export type MinimalConfig = {
    config?: string[] // List URL => env:,json://config.json,yaml://config.yml,zookeeper://127.0.0.1:8352?abs=aa&toto=anjd
    host?: string
    port?: number
} & PluginLoaderConfig

export interface ServerConfig extends MinimalConfig {
    dataBackend: string // Again URL
    apiPrefix: string
}