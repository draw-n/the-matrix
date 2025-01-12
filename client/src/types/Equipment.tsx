export interface Equipment {
    _id: string;
    name: string;
    routePath: string;
    type: string;
    properties?: { nozzle?: Number; materials?: string[] };
    status: string;
    description: string;
    imgSrc?: string;
}
