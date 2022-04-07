"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const helmet_1 = __importDefault(require("helmet"));
const utils_1 = require("./utils");
const monogdb_1 = require("./db/monogdb");
const route_decorators_1 = require("./routes/route.decorators");
const cors_1 = __importDefault(require("cors"));
require("./routes");
const app = express_1.default();
app.use(helmet_1.default());
app.use(cors_1.default());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
app.use((err, req, res, next) => {
    if (err && err.status === 400 && 'body' in err) {
        return utils_1.cdg.api(res, new Promise((resolve) => {
            resolve({
                status: 400,
                message: 'Bad request',
                data: [err.type]
            });
        }));
    }
    next();
});
route_decorators_1.setRoutes(app);
// 404 not found error handler
app.use((err, res) => {
    utils_1.cdg.konsole('Enterring 404 error');
    return utils_1.cdg.api(res, new Promise((resolve) => {
        resolve({
            status: 404,
            message: 'Route introuvable ou inexistante',
            data: []
        });
    }));
});
app.listen(utils_1.config.server.port, () => {
    utils_1.cdg.konsole("Serveur connectée! :: " + utils_1.config.server.port + "!");
    // Connection to mongodb database
    const uriDb = utils_1.config.mongo.uri + utils_1.config.mongo.name + '?authSource=admin';
    const db = new monogdb_1.Mongoose(uriDb, 'MongoDB connecté!');
    db.connect((Q) => {
        if (Q.status === 0) {
            utils_1.cdg.konsole(Q.data);
        }
        else {
            utils_1.cdg.konsole(Q.data, 1);
        }
    });
});
