import {ApplicationContext, Controller} from "@veyes/models";
import {NextFunction, Request, Response, Router} from ".store/@types-express-npm-4.17.21-be92a0245e/package";

export class UserController implements Controller {
    private context: ApplicationContext;

    constructor(context: ApplicationContext) {
        this.context = context;
    }

    private listUsers(req: Request, res: Response, next: NextFunction) {
        res.status(500)
    }

    private registerUser(req: Request, res: Response, next: NextFunction) {
        res.status(500)
    }

    private loginUser(req: Request, res: Response, next: NextFunction) {
        res.status(500)
    }

    private getUserInformation(req: Request, res: Response, next: NextFunction) {
        res.status(500)
    }

    private listAuthProvider(req: Request, res: Response, next: NextFunction) {
        res.status(500)
    }


    registerRoutes(router: Router) {
        router.get('/user', this.listUsers.bind(this))
        router.get('/user/:id', this.getUserInformation.bind(this))
        router.get('/', this.listAuthProvider.bind(this))
        // router.post('/:id/test')
        router.post('/signup', this.registerUser.bind(this))
        router.post('/login', this.loginUser.bind(this))
    }


}