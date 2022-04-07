let fs = require("fs");
import {cdg} from "../utils";

const levels = ['info', 'debug', 'warn', 'error'];

export class LoggerHelper {
    static log (payload: {type: any, message: any, service: any, module: any, content: any}) {
        if(cdg.inArray(payload.type, levels)) {
            console.log('entering log');
            LoggerHelper.createFile(payload);
            console.log(payload.message.replace('\n', ''))
            console.log('log done');
        } else {
            let message = new Date().toISOString() + "[error]Log type not found::[" + module + "]" +  "\n";

            LoggerHelper.createFile({
                service: 'ts_template',
                type: 'error',
                module: 'logger',
                content: payload,
            });
            console.error(message.replace('\n', ''))
        }
    }
    static createFile(payload: any) {
        let root;
        if(cdg.string.is_empty(payload.service)) {
            root = process.env.LOGGER_PATH + '/unknown';
        } else {
            root = process.env.LOGGER_PATH + '/' + payload.service;
        }

        if (!fs.existsSync(root)){
            console.log('folder not found... creating...')
            let Q = fs.mkdirSync(root);
            console.log('eeee', Q);
        }
        let filename = cdg.getDate();
        const logStream = fs.createWriteStream(root + '/' + filename + '.log', {
            flags: 'a',
            mode: 0o777,
        });
        if(payload.type !== 'info') {
            logStream.write(payload.message);
        }
    }
};
