import type {PackageJson, Packument, PackumentVersion} from '@npm/types';
import fs from 'fs'
import Path from 'path'
import os from "os";
import semver from 'semver'
import {Registry} from "@veyes/core";
import {
    DistMinimal,
    FoundPackage,
    PackageJsonVeyes,
    PluginBundle,
    PluginLoaderConfig,
    PluginLoaderIf
} from "@veyes/models";
import {mkdir} from "fs/promises"
import nodeFetch, {Response} from 'node-fetch'
import pickManifest from 'npm-pick-manifest'
import npmFetch, {pickRegistry} from 'npm-registry-fetch'
import nap from 'npm-package-arg'
import tar from 'tar'

const DOWNLOAD_DIRECTORY = Path.resolve(os.tmpdir(), "veyes-downloads", ".tarball")
const EXTRACT_DIRECTORY = Path.resolve(os.tmpdir(), "veyes-downloads")

export class PluginLoader implements PluginLoaderIf {
    private readonly config: PluginLoaderConfig;
    private registry: Registry<PluginBundle>;

    constructor(config: PluginLoaderConfig, pluginRegistry: Registry<PluginBundle>) {
        this.config = config
        this.registry = pluginRegistry
        this.updateNodePath()
    }

    private updateNodePath() {
        const currentPath = process.env.NODE_PATH || ''
        process.env.NODE_PATH = [...currentPath.split(Path.delimiter), ...this.config.pluginsDirectories.map(s => Path.resolve(s))].join(Path.delimiter)
    }

    async loadOrInstall(module: string) {
        const parseModule = nap(module)

        let packageRef: string | DistMinimal = module

        switch (parseModule.type) {
            case "version":
            case "range":
            case "tag":
                if (this.isExistingPackageValid(parseModule.name, parseModule.fetchSpec)) {
                    return this.loadModule(parseModule.name, parseModule.name)
                }
                // Gets the url to the TGZ from a configured registry
                packageRef = await this.lookupRegistry(parseModule)
            case "remote":
                let npmResolve = false
                let urlToFetch = parseModule.fetchSpec
                if (typeof packageRef !== "string") {
                    npmResolve = true
                    urlToFetch = packageRef.tarball
                }
                // Load the TGZ from remote => gets a path to
                packageRef = await this.loadRemotePlugin(urlToFetch, npmResolve)
            case "file":
                // Local TGZ
                packageRef = await this.loadTarGzPlugin(parseModule.fetchSpec)
            case "directory":
                const name = this.loadPackageJsonModule(packageRef).name
                // Extracted directory !
                this.loadModule(name, packageRef)
                break
            default:
                throw new Error("Unsupported package descriptor")
        }
    }

    private async loadRemotePlugin(fetchSpec: string, useNpm = false): Promise<string> {
        let response: Response

        if (useNpm) {
            response = await npmFetch(fetchSpec)
        } else {
            response = await nodeFetch(fetchSpec, {})
        }

        if (!fs.existsSync(DOWNLOAD_DIRECTORY)) {
            await mkdir(DOWNLOAD_DIRECTORY, {recursive: true}); //Optional if you already have downloads directory
        }

        const parseUrl = new URL(fetchSpec)

        const destination = Path.resolve(DOWNLOAD_DIRECTORY, Path.basename(parseUrl.pathname));

        const fileStream = fs.createWriteStream(destination);
        await new Promise((resolve, reject) => {
            response.body.pipe(fileStream);
            response.body.on("error", reject);
            fileStream.on("finish", resolve);
        });
        return destination
    }

    private async loadTarGzPlugin(fetchSpec: string) {

        const name = Path.basename(fetchSpec, Path.extname(fetchSpec))
        const dest = Path.resolve(EXTRACT_DIRECTORY, name)

        await mkdir(dest, {recursive: true})

        //spec is path to file
        await tar.extract({
            file: fetchSpec,
            cwd: dest
        })

        return Path.resolve(dest, "package")
    }

    private async lookupRegistry(packageArg: nap.Result): Promise<DistMinimal> {
        const registry = pickRegistry(packageArg.raw).replace(/\/?$/, '/')
        const packument = await npmFetch.json(`${registry}${packageArg.escapedName}`, this.config.npmConfig) as unknown as Packument

        const packumentVersion = pickManifest(packument) as PackumentVersion

        return {integrity: packumentVersion.dist.integrity, tarball: packumentVersion.dist.tarball}
    }

    private findAllNodeModulesDirs(): string[] {
        // In case NODE_PATH is defined with respect it
        let nodeModules = (process.env.NODE_PATH || '').split(Path.delimiter)
        const root = Path.resolve("/")
        let current = Path.resolve(__dirname)

        while (current !== root) {
            current = Path.join(current, '..')
            const nodeModulesPath = Path.join(current, 'node_modules')
            if (fs.existsSync(nodeModulesPath)) {
                nodeModules.push(nodeModulesPath)
            }
        }
        return nodeModules
    }

    private discoverPluginsFromFolders(nmPaths: string[]): FoundPackage[] {
        return nmPaths.flatMap(nodeModule => fs.readdirSync(nodeModule)
            .flatMap(f => {
                const modulePath = Path.join(nodeModule, f)
                if (f.startsWith("@")) {
                    return fs.readdirSync(modulePath).map((f1) => Path.join(modulePath, f1))
                } else {
                    return [modulePath]
                }
            })
            .map(f => Path.join(f, 'package.json'))
            .filter((f) => fs.existsSync(f))
            .map(f => ({
                path: f,
                packageJson: JSON.parse(fs.readFileSync(f, {encoding: "utf-8"})) as PackageJsonVeyes
            } as FoundPackage))
            .filter(f => f.packageJson.veyesPluginMetadata))
    }

    private loadPackageJsonModule(pathSpec: string) {
        console.log(`Loading metadata for ${pathSpec}`)
        return require(pathSpec + '/package.json') as PackageJson
    }

    private loadModule(name: string, moduleRef: string) {
        console.info(`Loading module from ${moduleRef}`)
        const imported: PluginBundle = require(moduleRef)

        //Add checks to ensure it is a valid-exported content !
        this.registry.register(imported, name)
    }

    private isExistingPackageValid(pathOrName: string, versionRange: string) {
        try {
            const loaded = require(pathOrName + '/package.json') as PackageJson
            return semver.satisfies(loaded.version, versionRange)
        } catch (e) {
            console.log(`Could not load ${pathOrName}`, e)
            return false
        }
    }

    loadAllModules() {
        const nodeModulePackagesJsonPaths = this.discoverPluginsFromFolders(this.findAllNodeModulesDirs())
        nodeModulePackagesJsonPaths.forEach(p => this.loadModule(p.packageJson.name, p.packageJson.name))
    }
}