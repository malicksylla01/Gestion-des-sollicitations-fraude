"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.XlsxHelper = void 0;
const node_xlsx_1 = __importDefault(require("node-xlsx"));
const utils_1 = require("../utils");
class XlsxHelper {
    static parse(payload) {
        return new Promise((resolve, reject) => {
            const workSheetsFromFile = node_xlsx_1.default.parse(payload);
            resolve(workSheetsFromFile);
        }).catch((e) => {
            utils_1.cdg.konsole(e, 1);
            return { error: true, data: 'Unable to parse received payload' };
        });
    }
}
exports.XlsxHelper = XlsxHelper;
