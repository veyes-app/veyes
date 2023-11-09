import {Registry} from "@veyes/core";
import {defaultConfig} from "./defaultConfig";
import {ConfigLoader, ConfigLoaderCreator, MinimalConfig, ServerConfig} from "@veyes/models";
import {CliConfigLoader} from "./cliConfigLoader";

export class BootstrapConfigLoader implements ConfigLoader {
    private registry: Registry<ConfigLoaderCreator>;
    private minimal: MinimalConfig;

    constructor(registry: Registry<ConfigLoaderCreator>, minimalConfig: MinimalConfig) {
        this.registry = registry
        this.minimal = minimalConfig
    }

    getConfiguration(): ServerConfig {
        const finalConfiguration: Record<string, any> = defaultConfig

        const URLs = this.minimal.config?.map(s => new URL(s)) || [new URL("cli://")]

        const configProviders = this.registry.list().map(v => new v[1]()).sort((a, b) => a.getPriority() - b.getPriority())
        console.log("Loaded ConfigLoader plugins: ", configProviders.map(p => p.constructor.name))

        for (let provider of configProviders) {

            for (let url of URLs) {
                if (!provider.canHandle(url)) {
                    console.log(`Config provider ${provider.constructor.name} cannot process config ${url.toString}`)
                    continue
                }

                Object.assign(finalConfiguration, provider.getConfiguration(url, finalConfiguration))
            }
        }

        return finalConfiguration as ServerConfig
    }

    canHandle(source: URL): boolean {
        return true;
    }

    getPriority(): number {
        return -1;
    }

}