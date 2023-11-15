import {PluginBundleApi, Registries} from "@veyes/core";
import {
    ApplicationContext,
    BuiltInApiGroup,
    CreatableController,
    DataBackendAPI,
    MinimalConfig,
    NewDataBackendAPI,
    ServerConfig
} from "@veyes/models";
import express, {Router} from 'express'
import wsExpress, {Application, Instance} from 'express-ws'
import http from 'http'
import {ApisController} from "./api";
import {routerLogger} from "./api/middleware";
import {BootstrapConfigLoader} from "./config/bootstrapLoader";
import {CliConfigLoader} from "./config/cliConfigLoader";
import {defaultConfig} from "./config/defaultConfig";
import {PluginLoader} from "./plugins";

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
        this.registries.forType(BuiltInApiGroup.controllerV1).register(ApisController, 'apis/v1')
    }

    private bootstrap() {
        console.log("Bootstrapping server")
        this.registries.forType(BuiltInApiGroup.configurationV1).register(CliConfigLoader)

        const cliConfig = defaultConfig;
        const cliLoader = new CliConfigLoader()
        Object.assign(cliConfig, cliLoader.getConfiguration())
        const minimalConfig: MinimalConfig = {pluginsDirectories: typeof cliConfig.pluginsDirectories === 'string' ? [cliConfig.pluginsDirectories] : cliConfig.pluginsDirectories}
        console.log("Found minimal config", minimalConfig)

        console.log("Initializing plugin system")
        this.pluginLoader = new PluginLoader(minimalConfig, this.registries.forType(BuiltInApiGroup.pluginsV1))
        console.log("Discover / Load modules...")
        this.pluginLoader.loadAllModules();
        this.pluginLoader.listLoadedModules();

        this.registerPlugins();

        console.log("Reading complete configuration from specified sources")
        this.config = new BootstrapConfigLoader(this.registries.forType(BuiltInApiGroup.configurationV1), minimalConfig).getConfiguration()
        console.log("Loaded configuration !")
        console.log(this.config)

        this.server.use(routerLogger)
    }

    private registerPlugins() {
        const allPlugins = this.registries
            .forType(BuiltInApiGroup.pluginsV1)
            .list() as [[string, PluginBundleApi]]

        allPlugins.forEach(([n, v]) => {
            for (let type of v.getRegistries().types()) {
                if (type === BuiltInApiGroup.pluginsV1) {
                    console.log(n, "is attempting to register plugin which is forbidden")
                }

                for (let rv of v.getRegistries().getRegistry(type).list()) {
                    try {
                        this.registries.forType(type).register(rv[1], rv[0])
                    } catch (e) {
                        console.warn(`Skip registering ${rv[0]} as it already exists`)
                    }
                }


            }
        })
    }

    private initializeDataBackend() {
        console.log("Initializing data-backend")
        if (!this.config.dataBackend) {
            throw new Error("No data-backend defined ")
        }

        const backendUrl = new URL(this.config.dataBackend)

        const backendProvider = this.registries.forType(BuiltInApiGroup.storageV1).list()
            .filter(([scheme,]) => backendUrl.protocol.slice(0, -1) === scheme)
            .shift()?.[1] as NewDataBackendAPI | undefined

        if (!backendProvider) {
            const providers = this.registries.forType(BuiltInApiGroup.storageV1).list().map(([k,]) => k)
            throw new Error(`Could not find any provider that can handle the following connection string ${this.config.dataBackend}; Available providers are: ${providers}'`)
        }

        this.dataBackend = new backendProvider(backendUrl)
    }

    start() {
        this.bootstrap();
        this.initializeDataBackend()
        this.initializeControllers()

        const httpServer = http.createServer(this.server).listen(this.config.port)

        const onErrorCb = (e) => {
            httpServer.close()
            console.error("Could not start server ", e)
        }

        httpServer.on('error', onErrorCb)
    }

    private initializeControllers() {
        const applicationContext: ApplicationContext = {
            dataBackend: this.dataBackend,
            registries: this.registries,
            pluginLoader: this.pluginLoader,
            runtimeConfig: this.config
        }
        this.registries.forType<CreatableController>(BuiltInApiGroup.controllerV1)
            .list()
            .forEach(([apiGroup, Controller]) => {
                const controller = new Controller(applicationContext)
                const router = Router()
                controller.registerRoutes(router)
                console.log("Register routes ", apiGroup,)
                this.server.use("/" + apiGroup, router)
            })
    }
}