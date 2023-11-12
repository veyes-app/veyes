import {ApplicationContext, BuiltInApiGroup, Controller} from "@veyes/models";
import {Router, NextFunction, Request, Response} from 'express'

export class PluginController implements Controller {
    private context: ApplicationContext;

    constructor(context: ApplicationContext) {
        this.context = context;
    }

    private listPlugins(req: Request, res: Response, next: NextFunction) {
        res.json(this.context.registries.getRegistry(BuiltInApiGroup.pluginsV1).list().map(v => v[0]))
    }

    private installPlugin(req: Request, res: Response, next: NextFunction) {
        res.status(500)
    }

    private getInfoPlugin(req: Request, res: Response, next: NextFunction) {
        res.status(500)
    }

    private deletePlugin(req: Request, res: Response, next: NextFunction) {
        res.status(500)
    }

    registerRoutes(router: Router) {
        router.get('/', this.listPlugins.bind(this))
        router.post('/', this.installPlugin.bind(this))
        router.get('/:id', this.getInfoPlugin.bind(this))
        router.delete('/:id', this.deletePlugin.bind(this))
    }


}
