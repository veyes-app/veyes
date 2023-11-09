import process from "process";
import {ConfigLoader, ServerConfig} from "@veyes/models";

export class CliConfigLoader implements ConfigLoader {
    constructor() {

    }

    private parseArgs(args: string[]): object {
        const sourceArgs = args.slice(2).filter(s => s.startsWith("-") || s.startsWith("--"))
        let final = {}
        for (let arg of sourceArgs) {
            const equalIndex = arg.indexOf("=")
            const key = arg.slice(arg.lastIndexOf("-", 1) + 1, equalIndex)
            const value = arg.slice(equalIndex + 1)

            const parts = key.split(".").filter(s => s)
            let currentNode = final
            const lastPart = parts.pop()
            let part
            while ((part = parts.shift()) !== undefined) {
                if (!currentNode[part]) {
                    currentNode[part] = {}
                }
                currentNode = currentNode[part]
            }

            if (currentNode[lastPart]) {
                if (typeof currentNode[lastPart] === 'string') {
                    currentNode[lastPart] = [currentNode[lastPart], value]
                } else {
                    currentNode[lastPart].push(value)
                }
            } else {
                currentNode[lastPart] = value
            }

        }
        return final
    }

    getConfiguration(): ServerConfig {
        return this.parseArgs(process.argv) as ServerConfig;
    }

    canHandle(configPath: URL): boolean {
        return true
    }

    getPriority(): number {
        return 0;
    }

}