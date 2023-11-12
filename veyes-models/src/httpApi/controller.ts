import {Router} from "express";
import {ApplicationContext} from "../app";

export interface Controller {
    registerRoutes(router: Router): void;
}

export interface CreatableController{
    new (app: ApplicationContext): Controller
}