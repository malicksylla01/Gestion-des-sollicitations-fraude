import {config, cdg} from '../utils';
export const routesRegister = new Array<any>();
export const routeDecorator = (router: any)  => {
    return (target: any, property: string) => {
            target[property] = router;
            routesRegister.push(router);
    }
};

export function setRoutes(app: any) {
    
    app.use('/api' + config.server.apiPath, routesRegister);
};