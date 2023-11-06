import {Request, Response, NextFunction, Router} from "express";
import {Application} from 'express-ws'
import * as console from "console";
import {Controller} from "@veyes/models";

export class ApisController implements Controller {
    private app: Application;

    constructor(app: Application) {
        this.app = app
    }

    listAllRoutesAndApis(req: Request, res: Response, next: NextFunction) {
        console.log(this.app.routes)
    }

    registerRoutes(router: Router) {
        router.route('/').get(this.listAllRoutesAndApis.bind(this))
    }

    getApiGroup(): string {
        return "";
    }

    getApiVersion(): string {
        return "";
    }
}


