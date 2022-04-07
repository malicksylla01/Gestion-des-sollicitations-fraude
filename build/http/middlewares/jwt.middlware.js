"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const utils_1 = require("../../utils");
class JwtMiddleware {
    static checkToken(req, res, next) {
        const authHeader = req.headers.authorization;
        if (authHeader) {
            const token = authHeader.split(' ')[1];
            jsonwebtoken_1.default.verify(token, utils_1.config.jwt.secret, (err, user) => {
                if (err) {
                    const errName = err.name;
                    let errLabel;
                    if (errName === 'TokenExpiredError') {
                        errLabel = 'Votre session a expiré';
                    }
                    else if (errName === 'JsonWebTokenError') {
                        errLabel = 'Signature du token invalide';
                    }
                    else {
                        errLabel = err;
                    }
                    return utils_1.cdg.api(res, new Promise((resolve) => {
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
        }
        else {
            return utils_1.cdg.api(res, new Promise((resolve) => {
                resolve({
                    status: 401,
                    message: 'Accès non autorisée',
                    data: ''
                });
            }));
        }
    }
    static checkAuth(req, res, next) {
        const authHeader = req.headers.authentication;
        if (authHeader) {
            const token = authHeader.split(' ')[1];
            jsonwebtoken_1.default.verify(token, utils_1.config.auth.secret, (err, user) => {
                if (err) {
                    let errName = err.name;
                    let errLabel;
                    if (errName === 'TokenExpiredError') {
                        errLabel = 'Votre session a expiré';
                    }
                    else if (errName === 'JsonWebTokenError') {
                        errLabel = 'Signature du token invalide';
                    }
                    else {
                        errLabel = err;
                    }
                    return utils_1.cdg.api(res, new Promise((resolve) => {
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
        }
        else {
            return utils_1.cdg.api(res, new Promise((resolve) => {
                resolve({
                    status: 401,
                    message: 'Accès API non autorisée',
                    data: ''
                });
            }));
        }
    }
    static generateAccessToken(payloads) {
        return new Promise((resolve, reject) => {
            // generate an access token - exp: Math.floor(Date.now() / 1000) + (60 * 60)
            const accessToken = jsonwebtoken_1.default.sign({}, utils_1.config.auth.secret, { expiresIn: (payloads.infinite ? '527040m' : '1440m') });
            resolve(accessToken);
        }).catch((e) => {
            utils_1.cdg.konsole(e, 1);
            return { error: true, data: 'Une erreur inconnue s\'est produite' };
        });
    }
}
exports.JwtMiddleware = JwtMiddleware;
