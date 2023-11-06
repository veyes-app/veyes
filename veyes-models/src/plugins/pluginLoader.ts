import type {Dist, PackageJson, Packument, PackumentVersion} from '@npm/types';
import type {Options} from 'npm-registry-fetch'

export interface PluginLoaderIf {
    loadOrInstall(module: string): Promise<void>;

    loadAllModules(): void;
}

export interface PluginLoaderConfig {
    pluginsDirectories: string[]
    npmConfig?: Options
}

export type VeyesMetadata = {
    id: string
    name: string
}

export interface PackageJsonVeyes extends PackageJson {
    veyesPluginMetadata?: VeyesMetadata
}

export interface FoundPackage {
    path: string
    packageJson: PackageJsonVeyes
}

export type DistMinimal = Omit<Dist, 'npm-signature' | 'fileCount' | 'shasum' | 'unpackedSize'>
