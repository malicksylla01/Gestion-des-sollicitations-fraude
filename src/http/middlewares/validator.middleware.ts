import { validationResult } from 'express-validator';
import { cdg } from '../../utils';

export class ValidatorMiddleware{

    static validate(req: any, res: any, next: any) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return cdg.api(res, new Promise(resolve =>{
                resolve({
                    status: 422,
                    message: "Information non correct",
                    data: errors,
                });
            }));
        }else{
            next();
        }
    }
    
}