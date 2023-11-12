import {ApplicationContext, BuiltInApiGroup, Controller} from "@veyes/models";
import {Router, Request, Response, NextFunction} from 'express'

export class DatasourceController implements Controller {
    private context: ApplicationContext;

    constructor(context: ApplicationContext) {
        this.context = context;
    }

    private listDatasource(req: Request, res: Response, next: NextFunction) {
        res.status(500)
    }

    private createDatasource(req: Request, res: Response, next: NextFunction) {
        res.status(500)
    }

    private getDatasource(req: Request, res: Response, next: NextFunction) {
        res.status(500)
    }

    private dataProxy(req: Request, res: Response, next: NextFunction) {
        res.status(500)
    }

    private deleteDatasource(req: Request, res: Response, next: NextFunction) {
        res.status(500)
    }

    private updateDatasource(req: Request, res: Response, next: NextFunction) {
        res.status(500)
    }

    registerRoutes(router: Router) {
        router.get('/', this.listDatasource.bind(this))
        router.post('/', this.createDatasource.bind(this))
        router.get('/:id', this.getDatasource.bind(this))
        router.put('/:id', this.updateDatasource.bind(this))
        router.delete('/:id', this.deleteDatasource.bind(this))
        router.all('/:id/query', this.dataProxy.bind(this))
    }


}