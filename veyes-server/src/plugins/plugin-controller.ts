import {Request, Response, NextFunction, Router} from "express";
import {Controller} from "@veyes/models";

import {ApplicationContext} from "../model/context";

export class PluginController implements Controller {
    constructor(app: ApplicationContext) {

    }

    installPlugin(req: Request, res: Response, next: NextFunction) {

    }

    listPlugins(req: Request, res: Response, next: NextFunction) {

    }

    uninstallPlugin(req: Request, res: Response, next: NextFunction) {

    }

    updatePlugin(req: Request, res: Response, next: NextFunction) {

    }

    getPlugin(req: Request, res: Response, next: NextFunction) {

    }

    getApiGroup(): string {
        return "plugins";
    }

    getApiVersion(): string {
        return "v1";
    }

    registerRoutes(router: Router): void {
        router.route("/")
            .get(this.listPlugins.bind(this))
            .post(this.installPlugin.bind(this))
        router.route("/:pluginUid")
            .delete(this.uninstallPlugin.bind(this))
            .put(this.updatePlugin.bind(this))
            .get(this.getPlugin.bind(this))
    }

}