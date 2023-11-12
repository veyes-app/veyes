import {Request, Response, NextFunction, Router} from "express";
import * as console from "console";
import {ApplicationContext, Controller} from "@veyes/models";

export class ApisController implements Controller {
    private context: ApplicationContext;

    constructor(app: ApplicationContext) {
        this.context = app
    }

    listAllRoutesAndApis(req: Request, res: Response, next: NextFunction) {
        console.log("listAllRoutesAndApis")
    }

    registerRoutes(router: Router) {
        router.route('/').get(this.listAllRoutesAndApis.bind(this))
    }
}


