import {ApplicationContext} from "@veyes/models";
import {Request} from "express";
import {RbacMiddleware} from "./rbac-middleware";
import {RoleRule, Verb} from "./types";

class MiddlewareTest extends RbacMiddleware {
    matchRole(requiredRole: RoleRule, userRole: RoleRule): boolean {
        return super.matchRole(requiredRole, userRole)
    }

    extractRequirement(req: Request): RoleRule {
        return super.extractRequirement(req);
    }
}

const context: Partial<ApplicationContext> = {
    runtimeConfig: {
        "apiPrefix": "/api/"
    }
}

describe('RBAC Middleware - matchRole', () => {

    const dashboardAllRole = {
        apiGroup: "dashboard/v1",
        verb: [Verb.ANY],
        resourceNames: ["*"],
        resources: ["*"]
    }


    it('should refuse undefined roles', () => {
        expect(new MiddlewareTest(undefined).matchRole(undefined, undefined)).toBeFalsy()
        expect(new MiddlewareTest(undefined).matchRole(dashboardAllRole, undefined)).toBeFalsy()
        expect(new MiddlewareTest(undefined).matchRole(undefined, dashboardAllRole)).toBeFalsy()
    });

    it('should refuse roles for difference apiGroups', () => {
        expect(new MiddlewareTest(undefined).matchRole({
                apiGroup: "test/v1",
                resourceNames: ["resourceName"],
                verb: [Verb.GET],
                resources: ["resource"]
            },
            dashboardAllRole)).toBeFalsy()
    });

    it('should refuse non matching verbs', () => {
        expect(new MiddlewareTest(undefined).matchRole({
                apiGroup: "dashboard/v1",
                resourceNames: ["resourceName"],
                verb: [Verb.GET],
                resources: ["resource"]
            },
            {
                apiGroup: "dashboard/v1",
                resourceNames: ["resourceName"],
                verb: [Verb.CREATE],
                resources: ["resource"]
            })).toBeFalsy()
    });

    it('should refuse non matching resource', () => {
        expect(new MiddlewareTest(undefined).matchRole({
                apiGroup: "dashboard/v1",
                resourceNames: ["resourceName"],
                verb: [Verb.GET],
                resources: ["resource"]
            },
            {
                apiGroup: "dashboard/v1",
                resourceNames: ["resourceName"],
                verb: [Verb.GET],
                resources: ["nonResource"]
            })).toBeFalsy()
    });

    it('should refuse non matching resourceName', () => {
        expect(new MiddlewareTest(undefined).matchRole({
                apiGroup: "dashboard/v1",
                resourceNames: ["resourceName"],
                verb: [Verb.GET],
                resources: ["resource"]
            },
            {
                apiGroup: "dashboard/v1",
                resourceNames: ["nonResourceName"],
                verb: [Verb.GET],
                resources: ["resource"]
            })).toBeFalsy()
    });

    it('should accept the "any" matching role', () => {
        expect(new MiddlewareTest(undefined).matchRole({
                apiGroup: "dashboard/v1",
                resourceNames: ["resourceName"],
                verb: [Verb.GET],
                resources: ["resource"]
            },
            dashboardAllRole)).toBeTruthy()
    });

    it('should accept equals matching role', () => {
        expect(new MiddlewareTest(undefined).matchRole({
                apiGroup: "dashboard/v1",
                resourceNames: ["resourceName"],
                verb: [Verb.GET],
                resources: ["resource"]
            },
            {
                apiGroup: "dashboard/v1",
                resourceNames: ["resourceName"],
                verb: [Verb.GET],
                resources: ["resource"]
            })).toBeTruthy()
    });

    it('should accept role matching at least one resource or verb or resourceName', () => {
        expect(new MiddlewareTest(undefined).matchRole({
                apiGroup: "dashboard/v1",
                resourceNames: ["resourceName"],
                verb: [Verb.GET],
                resources: ["resource"]
            },
            {
                apiGroup: "dashboard/v1",
                resourceNames: ["resourceName"],
                verb: [Verb.GET],
                resources: ["NonResource", "resource"]
            })).toBeTruthy()


        expect(new MiddlewareTest(undefined).matchRole({
                apiGroup: "dashboard/v1",
                resourceNames: ["resourceName"],
                verb: [Verb.GET],
                resources: ["resource"]
            },
            {
                apiGroup: "dashboard/v1",
                resourceNames: ["resourceName"],
                verb: [Verb.DELETE, Verb.GET],
                resources: ["resource"]
            })).toBeTruthy()


        expect(new MiddlewareTest(undefined).matchRole({
                apiGroup: "dashboard/v1",
                resourceNames: ["resourceName"],
                verb: [Verb.GET],
                resources: ["resource"]
            },
            {
                apiGroup: "dashboard/v1",
                resourceNames: ["NonresourceName", "resourceName"],
                verb: [Verb.GET],
                resources: ["resource"]
            })).toBeTruthy()
    });
});

describe('RBAC Middleware - extract current rule', () => {

    it('should be able to extract full url', () => {
        const req: Partial<Request> = {path: "/api/dashboard/v1/resType/name", method: "GET"}
        const req2: Partial<Request> = {path: "/api/dashboard/v1/resType/name", method: "DELETE"}
        const req3: Partial<Request> = {path: "/api/dashboard/v1/resType/name", method: "POST"}
        const req4: Partial<Request> = {path: "/api/dashboard/v1/resType/name", method: "PUT"}

        const expected: RoleRule = {
            verb: [Verb.GET],
            resources: ["resType"],
            apiGroup: "dashboard/v1",
            resourceNames: ["name"]
        }

        const expected2: RoleRule = {
            verb: [Verb.DELETE],
            resources: ["resType"],
            apiGroup: "dashboard/v1",
            resourceNames: ["name"]
        }

        const expected3: RoleRule = {
            verb: [Verb.CREATE],
            resources: ["resType"],
            apiGroup: "dashboard/v1",
            resourceNames: ["name"]
        }

        const expected4: RoleRule = {
            verb: [Verb.UPDATE],
            resources: ["resType"],
            apiGroup: "dashboard/v1",
            resourceNames: ["name"]
        }

        expect(new MiddlewareTest(context as ApplicationContext).extractRequirement(req as Request)).toStrictEqual(expected)
        expect(new MiddlewareTest(context as ApplicationContext).extractRequirement(req2 as Request)).toStrictEqual(expected2)
        expect(new MiddlewareTest(context as ApplicationContext).extractRequirement(req3 as Request)).toStrictEqual(expected3)
        expect(new MiddlewareTest(context as ApplicationContext).extractRequirement(req4 as Request)).toStrictEqual(expected4)
    });


    it('should be able to extract even if url is longer', () => {
        const req: Partial<Request> = {path: "/api/dashboard/v1/resType/name/sub?type=toto", method: "POST"}

        const expected: RoleRule = {
            verb: [Verb.CREATE],
            resources: ["resType"],
            apiGroup: "dashboard/v1",
            resourceNames: ["name"]
        }

        expect(new MiddlewareTest(context as ApplicationContext).extractRequirement(req as Request)).toStrictEqual(expected)
    });

    it('should be able to extract some partial URL but keep minimal requirements', () => {
        const req: Partial<Request> = {path: "/api/dashboard/v1/resType/", method: "GET"}

        const expected: RoleRule = {
            verb: [Verb.LIST],
            resources: ["resType"],
            apiGroup: "dashboard/v1",
            resourceNames: []
        }

        expect(new MiddlewareTest(context as ApplicationContext).extractRequirement(req as Request)).toStrictEqual(expected)
    });

    it('should fails on icomplete or unsupported methods ', () => {
        const req1: Partial<Request> = {path: "/api/dashboard/v1/", method: "POST"}
        const req2: Partial<Request> = {path: "/api/dashboard/v1/resource/name", method: "FAKE"}
        const req3: Partial<Request> = {path: "/api/", method: "GET"}

        expect(() => new MiddlewareTest(context as ApplicationContext).extractRequirement(req1 as Request)).toThrow()
        expect(() => new MiddlewareTest(context as ApplicationContext).extractRequirement(req2 as Request)).toThrow()
        expect(() => new MiddlewareTest(context as ApplicationContext).extractRequirement(req3 as Request)).toThrow()
    });
});

describe('RBAC Middleware - middleware function', () => {

    const req: Partial<Request> = {path: "/api/dashboard/v1/resource/name", method: "GET"}


    it('should return a middleware function', () => {
        expect(new RbacMiddleware(undefined).getMiddlewareFunction()).toBeDefined()
    });

    // it('should return 401 if not matching', () => {
    //     const res: Response = {json: jest.fn(), status: jest.fn()}
    //     const next = jest.fn()
    //
    // });

});