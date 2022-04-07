import jwt from 'jsonwebtoken';
import {config, cdg} from '../../utils';
export class JwtMiddleware {
    static checkToken(req: any, res: any, next: any) {
        const authHeader = req.headers.authorization;

        if (authHeader) {
            const token = authHeader.split(' ')[1];

            jwt.verify(token, config.jwt.secret!, (err: any, user: any) => {
                if (err) {
                    const errName = err.name;
                    let errLabel: string;
                    if(errName === 'TokenExpiredError') {
                        errLabel = 'Votre session a expiré'
                    } else if(errName === 'JsonWebTokenError') {
                        errLabel = 'Signature du token invalide'
                    } else {
                        errLabel = err
                    }
                    return cdg.api(res, new Promise((resolve)=>{
                        resolve({
                            status: 403,
                            message: errLabel,
                            data: ''
                        });
                    }));
                }

                req.user = user;
                next();
            });
        } else {
            return cdg.api(res, new Promise((resolve)=>{
                resolve({
                    status: 401,
                    message: 'Accès non autorisée',
                    data: ''
                });
            }));
        }
    }
    static checkAuth(req: any, res: any, next: any) {
        const authHeader = req.headers.authentication;

        if (authHeader) {
            const token = authHeader.split(' ')[1];

            jwt.verify(token, config.auth.secret!, (err: any, user: any) => {
                if (err) {
                    let errName = err.name;
                    let errLabel: string;
                    if(errName === 'TokenExpiredError') {
                        errLabel = 'Votre session a expiré'
                    } else if(errName === 'JsonWebTokenError') {
                        errLabel = 'Signature du token invalide'
                    } else {
                        errLabel = err
                    }
                    return cdg.api(res, new Promise((resolve)=>{
                        resolve({
                            status: 403,
                            message: errLabel,
                            data: ''
                        })
                    }));
                }

                req.user = user;
                next();
            });
        } else {
            return cdg.api(res, new Promise((resolve)=>{
                resolve({
                    status: 401,
                    message: 'Accès API non autorisée',
                    data: ''
                });
            }));
        }
    }
    static generateAccessToken(payloads: {infinite: boolean}){
        return new Promise((resolve, reject) => {
            // generate an access token - exp: Math.floor(Date.now() / 1000) + (60 * 60)
            const accessToken = jwt.sign({}, config.auth.secret!, { expiresIn: (payloads.infinite ? '527040m' : '1440m') });
            
            resolve(accessToken)
        }).catch((e) => {
            cdg.konsole(e, 1)
            return {error: true, data: 'Une erreur inconnue s\'est produite'}
        })
    }
}