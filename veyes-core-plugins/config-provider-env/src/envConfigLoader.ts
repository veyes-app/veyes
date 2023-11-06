import process from 'process'
import {ConfigLoader, ServerConfig} from "@veyes/models";

// interface EnvConfigLoaderOptions extends ConfigLoaderOptions {
//     prefix: string
//     respectCase: boolean
//     splitValue: string
// }

export class EnvConfigLoader implements ConfigLoader {
    private splitValue: string;
    private prefix: string;
    private respectCase: boolean;


    constructor() {
    }

    protected parseEnvironmentVariables(env: Object) {
        const envs = Object.entries(env)
            .filter(([key, v]) => {
                return (!this.respectCase ? key.toUpperCase() : key).startsWith(this.prefix)
            });
        let finalObj: object = {}

        for (let [envKey, value] of envs) {
            const processedEnvKey = envKey.substring(this.prefix.length, 0)
            const parts = processedEnvKey.split(this.splitValue).filter(value1 => value1)

            let currentNode = finalObj
            const lastPart = parts.pop()
            let part
            while ((part = parts.shift()) !== undefined) {
                if (!currentNode[part]) {
                    currentNode[part] = {}
                }
                currentNode = currentNode[part]
            }

            currentNode[lastPart] = value
        }

        return finalObj
    }

    getConfiguration(source: URL): ServerConfig {

        this.prefix = source.searchParams.get("prefix") || 'VEYES_'
        this.splitValue = source.searchParams.get("splitValue") || '_'
        this.respectCase = source.searchParams.get("respectCase") === "true" || false

        this.prefix = !this.respectCase ? this.prefix.toUpperCase() : this.prefix;


        return this.parseEnvironmentVariables(process.env) as ServerConfig
    }

    canHandle(configUrl: URL): boolean {
        return true;
    }

    getPriority(): number {
        return 100;
    }


}