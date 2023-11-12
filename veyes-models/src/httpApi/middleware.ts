import {NextFunction, Response, Request} from "express";
import {ApplicationContext} from "../app";

export interface Middleware {
    getMiddlewareFunction(): (req: Request, res: Response, next: NextFunction) => void;
}

export interface CreatableMiddleware {
    new(app: ApplicationContext): Middleware
}