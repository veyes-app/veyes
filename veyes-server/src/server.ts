
import express, {Express} from 'express'
import http from 'http'
import https from 'https'
import {PluginBundle} from '@veyes/models'

interface WebserverOptions {
    plugins: string[]
    pluginPath: string
}

export class WebServer {
    private server: Express

    constructor() {
        this.server = express()
    }

    private loadPlugins() {

    }

    private loadPlugin(path: string) {
        import(path).then((v) => {
            //v is an exported module (should)
            const exported: PluginBundle = v
            
        })
    }

    start() {
        http.createServer(this.server).listen(80)
        https.createServer(this.server).listen(443)
    }
}