import {ApplicationContext, BuiltInApiGroup, Controller} from "@veyes/models";
import {Router, Request, Response, NextFunction} from 'express'

export class RBACController implements Controller {
    private context: ApplicationContext;

    constructor(context: ApplicationContext) {
        this.context = context;
    }

    private createRole(req: Request, res: Response, next: NextFunction) {
        res.status(500)
    }

    private getRoles(req: Request, res: Response, next: NextFunction) {
        res.status(500)
    }

    private getRole(req: Request, res: Response, next: NextFunction) {
        res.status(500)
    }

    private updateRole(req: Request, res: Response, next: NextFunction) {
        res.status(500)
    }

    private deleteRole(req: Request, res: Response, next: NextFunction) {
        res.status(500)
    }

    private getRolesForUser(req: Request, res: Response, next: NextFunction) {

    }

    private createNewBinding(req: Request, res: Response, next: NextFunction) {

    }

    private deleteBinding(req: Request, res: Response, next: NextFunction) {

    }

    registerRoutes(router: Router) {
        router.post('/role', this.createRole.bind(this))
        router.get('/role', this.getRoles.bind(this))
        router.get('/role/:id', this.getRole.bind(this))
        router.delete('/role/:id', this.deleteRole.bind(this))
        router.put('/role/:id', this.updateRole.bind(this))

        router.get('/binding', this.getRolesForUser.bind(this))
        router.post('/binding', this.createNewBinding.bind(this))
        router.delete('/binding/:id', this.deleteBinding.bind(this))
    }

}