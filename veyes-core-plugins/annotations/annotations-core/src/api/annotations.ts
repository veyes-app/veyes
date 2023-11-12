import {ApplicationContext, BuiltInApiGroup, Controller} from "@veyes/models";
import {Router, Request, Response, NextFunction} from 'express'

export class AnnotationController implements Controller {
    private context: ApplicationContext;

    constructor(context: ApplicationContext) {
        this.context = context;
    }

    private listAnnotationProvider(req: Request, res: Response, next: NextFunction) {
        res.status(500)
    }

    private newAnnotationProvider(req: Request, res: Response, next: NextFunction) {
        res.status(500)
    }

    private getAnnotationProvider(req: Request, res: Response, next: NextFunction) {
        res.status(500)
    }

    private deleteProvider(req: Request, res: Response, next: NextFunction) {
        res.status(500)
    }

    private updateConfiguration(req: Request, res: Response, next: NextFunction) {
        res.status(500)
    }


    private queryAllAnnotation(req: Request, res: Response, next: NextFunction) {
        res.status(500)
    }

    private getAnnotation(req: Request, res: Response, next: NextFunction) {
        res.status(500)
    }

    private deleteAnnotation(req: Request, res: Response, next: NextFunction) {
        res.status(500)
    }

    private updateAnnotation(req: Request, res: Response, next: NextFunction) {
        res.status(500)
    }

    private createAnnotation(req: Request, res: Response, next: NextFunction) {
        res.status(500)
    }

    registerRoutes(router: Router) {
        router.get('/', this.listAnnotationProvider.bind(this))
        router.post('/', this.newAnnotationProvider.bind(this))

        router.get('/:id', this.getAnnotationProvider.bind(this))
        router.put('/:id', this.updateConfiguration.bind(this))
        router.delete('/:id', this.deleteProvider.bind(this))

        router.get('/:id/annotation', this.queryAllAnnotation.bind(this))
        router.post('/:id/annotation', this.createAnnotation.bind(this))
        router.get('/:id/annotation/:annotationId', this.getAnnotation.bind(this))
        router.put('/:id/annotation/:annotationId', this.updateAnnotation.bind(this))
        router.delete('/:id/annotation/:annotationId', this.deleteAnnotation.bind(this))
    }

}