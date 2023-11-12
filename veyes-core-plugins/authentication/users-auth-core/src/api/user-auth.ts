import {ApplicationContext, Middleware} from "@veyes/models";
import {NextFunction, Request, Response} from "express";

export class UserAuthMiddleware implements Middleware {
    private context: ApplicationContext;

    constructor(context: ApplicationContext) {
        this.context = context;
    }

    private middlewareHandler(req: Request, res: Response, next: NextFunction) {
        // Check user authentication !
    }

    getMiddlewareFunction(): (req: Request, res: Response, next: NextFunction) => void {
        return this.middlewareHandler.bind(this)
    }
}