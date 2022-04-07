"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoute = void 0;
const express_1 = require("express");
const route_decorators_1 = require("./route.decorators");
const utils_1 = require("../utils");
const controllers_1 = require("../http/controllers");
const middlewares_1 = require("../http/middlewares");
const models_1 = require("../models");
const route = express_1.Router();
route.post('/saves', middlewares_1.MulterMiddleware.multiple, middlewares_1.ValidatorMiddleware.validate, (req, res) => {
    const body = req.body;
    let Q = models_1.MainSet.save(body);
    return utils_1.cdg.api(res, Q);
});
route.delete('/remove/:slug', middlewares_1.JwtMiddleware.checkToken, (req, res) => {
    const params = req.params;
    let Q = controllers_1.MainController.remove(params);
    return utils_1.cdg.api(res, Q);
});
route.get('/select/:payload?', middlewares_1.JwtMiddleware.checkToken, (req, res) => {
    const payload = req.params.payload;
    let Q = controllers_1.MainController.select(payload);
    return utils_1.cdg.api(res, Q);
});
class UserRoute {
    constructor() { }
}
__decorate([
    route_decorators_1.routeDecorator(route),
    __metadata("design:type", Object)
], UserRoute, "router", void 0);
exports.UserRoute = UserRoute;
