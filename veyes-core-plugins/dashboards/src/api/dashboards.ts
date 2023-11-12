import {ApplicationContext, Controller} from "@veyes/models";
import {Router, Request, Response, NextFunction} from 'express'

export class DashboardController implements Controller {
    private context: ApplicationContext;

    constructor(context: ApplicationContext) {
        this.context = context;
    }

    private listDashboards(req: Request, res: Response, next: NextFunction) {
        res.status(500)
    }

    private createDashboard(req: Request, res: Response, next: NextFunction) {
        res.status(500)
    }

    private getDashboard(req: Request, res: Response, next: NextFunction) {
        res.status(500)
    }

    private deleteDatasource(req: Request, res: Response, next: NextFunction) {
        res.status(500)
    }

    private updateDashboard(req: Request, res: Response, next: NextFunction) {
        res.status(500)
    }

    private deleteDashboardVersion(req: Request, res: Response, next: NextFunction) {
        res.status(500)
    }

    private getDashboardVersion(req: Request, res: Response, next: NextFunction) {
        res.status(500)
    }


    private listDashboardVersions(req: Request, res: Response, next: NextFunction) {
        res.status(500)
    }


    registerRoutes(router: Router) {
        router.get('/', this.listDashboards.bind(this)) // List all dashboards
        router.post('/', this.createDashboard.bind(this)) // Create new dashboard

        router.get('/:id', this.getDashboard.bind(this)) // Get a dashboard
        router.put('/:id', this.updateDashboard.bind(this))  // Save a dashboard => creates a new version
        router.delete('/:id', this.deleteDatasource.bind(this)) // Delete a dashboard => removes all versions

        router.get('/:id/version', this.listDashboardVersions.bind(this))
        router.get('/:id/version/:version', this.getDashboardVersion.bind(this))
        router.delete('/:id/version/:version', this.deleteDashboardVersion.bind(this))
    }


}