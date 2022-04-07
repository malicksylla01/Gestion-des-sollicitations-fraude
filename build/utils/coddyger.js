"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cdg = void 0;
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
const fs_1 = __importDefault(require("fs"));
const bcrypt_1 = __importDefault(require("bcrypt"));
exports.cdg = {
    api: (context, promise) => {
        promise.then((res) => {
            let status = res.status;
            let message = res.message;
            let data = res.data;
            let response = {
                status: status,
                message: message,
                data: (data !== undefined || true ? data : [])
            };
            return context.status(status).json(response);
        }).catch((err) => {
            return context.status(status).json(err);
        }).catch((err) => {
            return context.status(500).json({ error: true, message: "une erreur interne s'est produite veuillez réessayer plus tard" });
        });
    },
    konsole: (msg, error = 0) => {
        let message = new Date().toISOString() + "[" + (error === 1 ? 'error' : 'info') + "]" + JSON.stringify(msg);
        if (error === 1) {
            console.error(message);
        }
        else {
            console.log(message);
        }
    },
    string: {
        is_empty: function (value) {
            return (value === undefined || value === null || value.length <= 0 || value === '');
        },
        is_email: function (value) {
            return /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(value);
        },
        is_url: function (value) {
            return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(value);
        },
        is_number: function (value) {
            return /^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(value);
        },
        is_date: function (value) {
            if (Object.prototype.toString.call(value) === "[object Date]") {
                return !isNaN(value.getTime());
            }
            else {
                return false;
            }
        },
    },
    encryptPassword: (payload) => {
        const saltRounds = 10;
        return new Promise((resolve) => {
            bcrypt_1.default.genSalt(saltRounds, function (err, salt) {
                bcrypt_1.default.hash(payload, salt, function (err, hash) {
                    if (err)
                        resolve(false);
                    // Store hash in your password DB.
                    resolve(hash);
                });
            });
        });
    },
    verifyPassword: (payload, hash) => {
        return new Promise((resolve) => {
            // Load hash from your password DB.
            bcrypt_1.default.compare(payload, hash, function (err, result) {
                // result == true
                if (err)
                    resolve(false);
                // Store hash in your password DB.
                resolve(result);
            });
        });
    },
    generateSlug: () => {
        return uuid_1.v4();
    },
    buildApiError: (payload) => {
        let error = {
            errors: {
                value: exports.cdg.string.is_empty(payload.value) ? '' : payload.value,
                msg: payload.msg,
                param: exports.cdg.string.is_empty(payload.param) ? '' : payload.param,
                location: exports.cdg.string.is_empty(payload.location) ? '' : payload.location,
            }
        };
        return error;
    },
    inArray: function (needle, haystack) {
        let length = haystack.length;
        for (let i = 0; i < length; i++) {
            if (haystack[i] === needle)
                return true;
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
    genRandHex: (size) => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join(""),
    file: {
        remove: function (filePath) {
            return fs_1.default.unlinkSync(filePath);
        },
        extension: function (filename) {
            return path_1.default.extname(filename).toLowerCase();
        },
        toBase64: (filename) => {
            return fs_1.default.readFileSync(filename, { encoding: "base64" });
        },
        exists: (filePath) => {
            return fs_1.default.existsSync(filePath);
        },
    },
    object: {
        is_empty: function (obj) {
            for (let key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                    return false;
                }
            }
            return true;
        },
    },
    root: () => {
        return path_1.default.resolve(__dirname);
    },
};
