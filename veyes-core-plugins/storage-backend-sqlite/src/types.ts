import Database from "better-sqlite3";

export interface SqliteBackendConfig {
    file: string
    options?: Database.Options
}

