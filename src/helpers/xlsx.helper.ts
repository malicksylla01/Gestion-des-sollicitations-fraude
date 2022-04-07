import xlsx from 'node-xlsx';
import {MainSet} from '../models';
import {cdg, config} from '../utils';

export class XlsxHelper {
    static parse(payload: string) {
        return new Promise((resolve, reject) => {
            const workSheetsFromFile = xlsx.parse(payload);

            resolve(workSheetsFromFile)
        }).catch((e) => {
            cdg.konsole(e, 1)
            return {error: true, data: 'Unable to parse received payload'}
        })
    }
}
