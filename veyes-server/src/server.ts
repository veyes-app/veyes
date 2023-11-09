import express from 'express'
import wsExpress, {Application, Instance} from 'express-ws'
import http from 'http'
import https from 'https'
import {PluginLoader} from "./plugins";
import {CliConfigLoader} from "./config/cliConfigLoader";
import {BootstrapConfigLoader} from "./config/bootstrapLoader";
import {Registries} from "@veyes/core";
import {DataBackendAPI, KnownRegistryTypes, MinimalConfig, NewDataBackendAPI, ServerConfig} from "@veyes/models";
import {defaultConfig} from "./config/defaultConfig";

interface WebserverOptions {
    plugins: string[]
    pluginPath: string
}

export class WebServer {
    private readonly wsServer: Instance;
    private readonly server: Application;
    private readonly registries: Registries
    private pluginLoader: PluginLoader;
    private config: ServerConfig;
    private dataBackend: DataBackendAPI

    constructor() {
        console.log("Creating new Webserver...")
        this.wsServer = wsExpress(express())
        this.server = this.wsServer.app
        this.registries = new Registries()
    }

    private bootstrap() {
        console.log("Bootstrapping server")
        this.registries.forType(KnownRegistryTypes.ConfigProviders).register(CliConfigLoader)

        const cliConfig = defaultConfig;
        const cliLoader = new CliConfigLoader()
        Object.assign(cliConfig, cliLoader.getConfiguration())
        const minimalConfig: MinimalConfig = {pluginsDirectories: typeof cliConfig.pluginsDirectories === 'string' ? [cliConfig.pluginsDirectories] : cliConfig.pluginsDirectories}
        console.log("Found minimal config", minimalConfig)

        console.log("Initializing plugin system")
        this.pluginLoader = new PluginLoader(minimalConfig, this.registries.forType(KnownRegistryTypes.Plugins))
        console.log("Discover / Load modules...")
        this.pluginLoader.loadAllModules();

        console.log("Reading complete configuration from specified sources")
        this.config = new BootstrapConfigLoader(this.registries.forType(KnownRegistryTypes.ConfigProviders), minimalConfig).getConfiguration()
        console.log("Loaded configuration !")
        console.log(this.config)
    }

    private initializeDataBackend() {
        console.log("Initializing data-backend")
        if (!this.config.dataBackend) {
            throw new Error("No data-backend defined ")
        }

        const backendUrl = new URL(this.config.dataBackend)
        const backendProvider = this.registries.forType(KnownRegistryTypes.DataBackendProvider).list()
            .filter(([scheme,]) => backendUrl.protocol === scheme)
            .shift()?.[1] as NewDataBackendAPI | undefined

        if (!backendProvider) {
            const providers = this.registries.forType(KnownRegistryTypes.DataBackendProvider).list().map(([k,]) => k)
            throw new Error(`Could not find any provider that can handle the following connection string ${this.config.dataBackend}; Available providers are: ${providers}'`)
        }

        this.dataBackend = new backendProvider(backendUrl)
    }

    start() {

        this.bootstrap();
        this.initializeDataBackend()

        const httpServer = http.createServer(this.server).listen(80)
        const httpsServer = https.createServer(this.server).listen(443)

        const onErrorCb = (e) => {
            httpsServer.close()
            httpServer.close()
            console.error("Could not start server ", e)
        }

        httpServer.on('error', onErrorCb)
        httpsServer.on('error', onErrorCb)
    }

}