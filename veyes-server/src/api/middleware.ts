import {NextFunction, Request, Response} from "express";

export function routerLogger(req: Request, res: Response, next: NextFunction) {
    console.log("Request: ", req.path)
    next()
}