import {Router} from "express";
import {ApplicationContext} from "../app/applicationContext";

export interface Controller {
    registerRoutes(router: Router): void;
    getApiGroup(): string
    getApiVersion(): string
}

export interface CreatableController{
    new (app: ApplicationContext): Controller
}