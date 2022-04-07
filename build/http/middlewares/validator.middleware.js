"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidatorMiddleware = void 0;
const express_validator_1 = require("express-validator");
const utils_1 = require("../../utils");
class ValidatorMiddleware {
    static validate(req, res, next) {
        const errors = express_validator_1.validationResult(req);
        if (!errors.isEmpty()) {
            return utils_1.cdg.api(res, new Promise(resolve => {
                resolve({
                    status: 422,
                    message: "Information non correct",
                    data: errors,
                });
            }));
        }
        else {
            next();
        }
    }
}
exports.ValidatorMiddleware = ValidatorMiddleware;
