"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setRoutes = exports.routeDecorator = exports.routesRegister = void 0;
const utils_1 = require("../utils");
exports.routesRegister = new Array();
const routeDecorator = (router) => {
    return (target, property) => {
        target[property] = router;
        exports.routesRegister.push(router);
    };
};
exports.routeDecorator = routeDecorator;
function setRoutes(app) {
    app.use('/api' + utils_1.config.server.apiPath, exports.routesRegister);
}
exports.setRoutes = setRoutes;
;
