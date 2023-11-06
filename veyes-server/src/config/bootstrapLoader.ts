import {Registry} from "@veyes/core";
import {defaultConfig} from "./defaultConfig";
import {ConfigLoader, MinimalConfig, ServerConfig} from "@veyes/models";

export class BootstrapConfigLoader implements ConfigLoader {
    private registry: Registry<ConfigLoader>;
    private minimal: MinimalConfig;

    constructor(registry: Registry<ConfigLoader>, minimalConfig: MinimalConfig) {
        this.registry = registry
        this.minimal = minimalConfig
    }

    getConfiguration(): ServerConfig {
        const finalConfiguration: Record<string, any> = defaultConfig

        const URLs = this.minimal.config.map(s => new URL(s))

        const configProviders = this.registry.list().map(v => v[1]).sort((a, b) => a.getPriority() - b.getPriority())

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