export interface User {

}

export enum Verb {
    GET = 'get',
    LIST = 'list',
    DELETE = 'delete',
    CREATE = "create",
    UPDATE = "update",
    ANY = '*'
}

export interface RoleRule {
    apiGroup: string
    verb: Verb[]
    resources: string[]
    resourceNames: string[]
}

export interface Role {
    name: string
    rules: RoleRule[]
}