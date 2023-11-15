import {ApplicationContext, Middleware} from "@veyes/models";
import {NextFunction, Request, Response, text} from "express";
import {Role, RoleRule, User, Verb} from "./types";

export class RbacMiddleware implements Middleware {
    constructor(public context: ApplicationContext) {
    }

    private middlewareHandler(req: Request, res: Response, next: NextFunction) {
        // Check user authorization !
        const requiredRoleRule = this.extractRequirement(req)

        if (!this.hasPermission(req, requiredRoleRule)) {
            res.status(401).json({message: `You do not have the ${requiredRoleRule.verb} on ApiGroup ${requiredRoleRule.apiGroup} for resource ${requiredRoleRule.resources} and names ${requiredRoleRule.resourceNames}`})
        } else {
            next()
        }
    }

    protected extractRequirement(req: Request): RoleRule {
        const pathNoPrefix = req.path.slice(this.context.runtimeConfig['apiPrefix'].length,)
        const regex = /^\/?(?<apiGroup>[^/]+\/[^/]+)\/(?<resource>[^/]+)(\/(?<resourceName>[^/]+))?/gm;
        const matches = regex.exec(pathNoPrefix)
        if (!matches || !matches.groups) {
            throw new Error("Could not extract mandatory content from request")
        }
        const {apiGroup, resourceName, resource} = matches.groups
        const verb = this.verbFromMethod(req.method, resourceName)

        return {
            verb: verb ? [verb] : [],
            resourceNames: resourceName ? [resourceName] : [],
            resources: resource ? [resource] : [],
            apiGroup: apiGroup
        }
    }

    private verbFromMethod(method: string, resourceName: string | undefined): Verb {
        switch (method.toLowerCase()) {
            case 'get':
                if (resourceName) {
                    return Verb.GET
                }
                return Verb.LIST
            case 'put':
                return Verb.UPDATE;
            case 'delete':
                return Verb.DELETE;
            case 'post':
                return Verb.CREATE
            default:
                throw new Error("Unknown method")
        }
    }

    protected hasPermission(req: Request, requiredRoleRule: RoleRule): boolean {
        const user = this.getUser(req)
        const roles = this.getUserRoles(user).flatMap(r => r.rules)
        const matchingRole = roles.find(r => this.matchRole(requiredRoleRule, r))

        return !!matchingRole;
    }

    matchRole(requiredRole: RoleRule, userRole: RoleRule): boolean {
        if (!requiredRole || !userRole) {
            return false
        }

        if ((!requiredRole.apiGroup || !userRole.apiGroup) || userRole.apiGroup !== requiredRole.apiGroup) {
            return false
        }

        if ((!requiredRole.verb || !userRole.verb) || (!userRole.verb.includes(Verb.ANY) && !userRole.verb.includes(requiredRole.verb[0]))) {
            return false
        }

        if ((!requiredRole.resources || !userRole.resources) || (!userRole.resources.includes("*") && !userRole.resources.includes(requiredRole.resources[0]))) {
            return false
        }

        if ((!requiredRole.resources || !userRole.resources) || (!userRole.resourceNames.includes("*") && !userRole.resourceNames.includes(requiredRole.resourceNames[0]))) {
            return false
        }

        return true
    }

    private getUser(req: Request): User {
        return undefined;
    }

    private getUserRoles(user: User): Role[] {
        return [];
    }

    getMiddlewareFunction(): (req: Request, res: Response, next: NextFunction) => void {
        return this.middlewareHandler.bind(this)
    }


}