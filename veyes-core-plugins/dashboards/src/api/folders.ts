import {ApplicationContext, BuiltInApiGroup, Controller} from "@veyes/models";
import {Router, Request, Response, NextFunction} from 'express'

export class FolderController implements Controller {
    private context: ApplicationContext;

    constructor(context: ApplicationContext) {
        this.context = context;
    }

    private listFolder(req: Request, res: Response, next: NextFunction) {
        res.status(500)
    }

    private createFolder(req: Request, res: Response, next: NextFunction) {
        res.status(500)
    }

    private getFolder(req: Request, res: Response, next: NextFunction) {
        res.status(500)
    }


    private deleteFolder(req: Request, res: Response, next: NextFunction) {
        res.status(500)
    }

    private updateDatasource(req: Request, res: Response, next: NextFunction) {
        res.status(500)
    }


    private addContentToFolder(req: Request, res: Response, next: NextFunction) {
        res.status(500)
    }

    registerRoutes(router: Router) {
        router.get('/', this.listFolder.bind(this))
        router.post('/', this.createFolder.bind(this))

        router.get('/:id', this.getFolder.bind(this))
        router.put('/:id', this.updateDatasource.bind(this))
        router.post('/:id', this.addContentToFolder.bind(this))
        router.delete('/:id', this.deleteFolder.bind(this))
    }


}