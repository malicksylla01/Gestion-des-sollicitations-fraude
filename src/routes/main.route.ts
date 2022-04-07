import {Router} from 'express';
import { routeDecorator } from './route.decorators';
import { cdg } from '../utils';
import { LoggerHelper } from '../helpers';
import { MainController } from '../http/controllers';
import { JwtMiddleware, ValidatorMiddleware, MulterMiddleware } from '../http/middlewares';
import {body} from 'express-validator';
import { MainSet } from '../models';

const route = Router();

interface File {
    path: string,
    mimetype: string,
}


route.post('/saves',
    MulterMiddleware.single,
    ValidatorMiddleware.validate,
    
    (req: any, res: any) => {
        const body = req.body

        let Q = MainSet.save(body)

        return cdg.api(res, Q);
});


export class UserRoute {
    @routeDecorator(route) 
    static router: any;
    constructor() { }
}