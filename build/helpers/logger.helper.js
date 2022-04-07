"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerHelper = void 0;
let fs = require("fs");
const utils_1 = require("../utils");
const levels = ['info', 'debug', 'warn', 'error'];
class LoggerHelper {
    static log(payload) {
        if (utils_1.cdg.inArray(payload.type, levels)) {
            console.log('entering log');
            LoggerHelper.createFile(payload);
            console.log(payload.message.replace('\n', ''));
            console.log('log done');
        }
        else {
            let message = new Date().toISOString() + "[error]Log type not found::[" + module + "]" + "\n";
            LoggerHelper.createFile({
                service: 'ts_template',
                type: 'error',
                module: 'logger',
                content: payload,
            });
            console.error(message.replace('\n', ''));
        }
    }
    static createFile(payload) {
        let root;
        if (utils_1.cdg.string.is_empty(payload.service)) {
            root = process.env.LOGGER_PATH + '/unknown';
        }
        else {
            root = process.env.LOGGER_PATH + '/' + payload.service;
        }
        if (!fs.existsSync(root)) {
            console.log('folder not found... creating...');
            let Q = fs.mkdirSync(root);
            console.log('eeee', Q);
        }
        let filename = utils_1.cdg.getDate();
        const logStream = fs.createWriteStream(root + '/' + filename + '.log', {
            flags: 'a',
            mode: 0o777,
        });
        if (payload.type !== 'info') {
            logStream.write(payload.message);
        }
    }
}
exports.LoggerHelper = LoggerHelper;
;
