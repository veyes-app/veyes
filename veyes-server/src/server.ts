import express from 'express'
import wsExpress, {Application, Instance} from 'express-ws'
import http from 'http'
import https from 'https'
import {PluginLoader} from "./plugins";
import {CliConfigLoader} from "./config/cliConfigLoader";
import {BootstrapConfigLoader} from "./config/bootstrapLoader";
import {Registries} from "@veyes/core";
import {DataBackendAPI, KnownRegistryTypes, MinimalConfig, NewDataBackendAPI, ServerConfig} from "@veyes/models";

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
        this.wsServer = wsExpress(express())
        this.server = this.wsServer.app
        this.registries = new Registries()
    }

    private bootstrap() {
        const cliLoader = new CliConfigLoader()
        this.registries.forType(KnownRegistryTypes.ConfigProviders).register(cliLoader)

        const cliConfig = cliLoader.getConfiguration()
        const minimalConfig: MinimalConfig = {pluginsDirectories: cliConfig.pluginsDirectories}

        this.pluginLoader = new PluginLoader(minimalConfig, this.registries.forType(KnownRegistryTypes.Plugins))
        this.pluginLoader.loadAllModules();

        this.config = new BootstrapConfigLoader(this.registries.forType(KnownRegistryTypes.ConfigProviders), minimalConfig).getConfiguration()
    }

    private initializeDataBackend() {
        if (!this.config.dataBackend) {
            throw new Error("No data-backend defined ")
        }
        const backendUrl = new URL(this.config.dataBackend)
        const backendProvider = this.registries.forType(KnownRegistryTypes.DataBackendProvider).list()
            .filter(([scheme,]) => backendUrl.protocol === scheme)
            .shift()[1] as NewDataBackendAPI | undefined

        if (!backendProvider) {
            throw new Error(`Could not find any provider that can handle the following connection string ${this.config.dataBackend}`)
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