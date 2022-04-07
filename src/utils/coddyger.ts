import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import axios from 'axios';

import bcrypt from 'bcrypt';
 
export const cdg = {
    api: (context: any, promise: Promise<any>) => {
            promise.then((res: any)=>{
            let status = res.status;
            let message = res.message;
            let data = res.data;

            let response = {
                status: status,
                message: message,
                data: (data !== undefined || true ? data : [])
            };
            
            return context.status(status).json(response);
        }).catch((err:any)=>{
            return context.status(status).json(err);
        }).catch((err: any)=>{
            return context.status(500).json({error: true, message: "une erreur interne s'est produite veuillez réessayer plus tard"});
        })
    },
    konsole: (msg: any, error = 0) => {
        let message = new Date().toISOString() + "[" + (error === 1 ? 'error' : 'info') + "]" + JSON.stringify(msg);
        if (error === 1) {
            console.error(message)
        } else {
            console.log(message);
        }
    },
    string: {
        is_empty: function(value: any) {
            return (value === undefined || value === null || value.length <= 0 || value === '');
        },
        is_email: function(value: any) {
            return /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(value);
        },
        is_url: function(value: any) {
            return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(value);
        },
        is_number: function(value: any) {
            return /^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(value);
        },
        is_date: function(value: any) {
            if (Object.prototype.toString.call(value) === "[object Date]") {
                return !isNaN(value.getTime());
            } else {
                return false
            }
        },
    },
    encryptPassword: (payload: any) => {
        const saltRounds = 10;

        return new Promise((resolve) => {
            bcrypt.genSalt(saltRounds, function(err: any, salt: any) {
                bcrypt.hash(payload, salt, function(err: any, hash: any) {
                    if(err) resolve(false);
                    // Store hash in your password DB.
                    resolve(hash)
                });
            });
        });
    },
    verifyPassword: (payload: any, hash: any) => {
        return new Promise((resolve) => {
            // Load hash from your password DB.
            bcrypt.compare(payload, hash, function(err: any, result: boolean) {
                // result == true
                if(err) resolve(false);
                 // Store hash in your password DB.
                resolve(result)
            });
        });
    },
    generateSlug: () => {
        return uuidv4();
    },
    buildApiError: (payload: any) => {
        let error = {
            errors: {
                value: cdg.string.is_empty(payload.value) ? '' : payload.value,
                msg: payload.msg,
                param: cdg.string.is_empty(payload.param) ? '' : payload.param,
                location: cdg.string.is_empty(payload.location) ? '' : payload.location,
            }
        }

        return error;
    },
    inArray: function (needle: any, haystack: any) {
        let length = haystack.length;
        for (let i = 0; i < length; i++) {
          if (haystack[i] === needle) return true;
        }
        return false;
    },
    getDate: () => {
        let today = new Date();
        let year = today.getFullYear();
        let month = today.getMonth() + 1;
        let day = today.getDate();
        let date = year + "-" + month + "-" + day;
        return date;
    },
    genRandHex: (size: any) =>
    [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join(""),
    file: {
        remove: function (filePath: string) {
          return fs.unlinkSync(filePath);
        },
        extension: function (filename: string) {
          return path.extname(filename).toLowerCase();
        },
        toBase64: (filename: string) => {
          return fs.readFileSync(filename, { encoding: "base64" });
        },
        exists: (filePath: string) => {
          return fs.existsSync(filePath);
        },
    },
    object: {
        is_empty: function (obj: object) {
          for (let key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
              return false;
            }
          }
          return true;
        },
      },
    root: () => {
        return path.resolve(__dirname);
    },
}