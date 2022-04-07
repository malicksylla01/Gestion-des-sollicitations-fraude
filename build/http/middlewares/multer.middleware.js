"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MulterMiddleware = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const mime_types_1 = __importDefault(require("mime-types"));
const utils_1 = require("../../utils");
class MulterMiddleware {
    static single(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            yield MulterMiddleware.buildUploadPath();
            let allowedExtension = ['jpg', 'jpeg', 'png'];
            const upload = multer_1.default({
                dest: MulterMiddleware.uploadPathTmp,
                fileFilter: (req, file, cb) => {
                    if (!utils_1.cdg.inArray(MulterMiddleware.buildExt(file.mimetype), allowedExtension)) {
                        req.fileValidationError = 'Type de fichier non autorisé';
                        return utils_1.cdg.api(res, new Promise((resolve) => {
                            resolve({
                                status: 422,
                                message: 'error',
                                data: utils_1.cdg.buildApiError({ msg: 'Type de fichier non autorisé' })
                            });
                        }));
                    }
                    cb(null, true);
                }
            }).single("file");
            upload(req, res, function (err) {
                if (req.file) {
                    if (err instanceof multer_1.default.MulterError) {
                        if (err.code === 'LIMIT_FILE_SIZE') {
                            err.message = "Fichier trop volumineux";
                        }
                        else if (err.code === 'LIMIT_FILE_COUNT') {
                            err.message = "Nombre maximum de fichier atteint";
                        }
                        return utils_1.cdg.api(res, new Promise((resolve) => {
                            resolve({
                                status: 401,
                                message: 'error',
                                data: utils_1.cdg.buildApiError({ msg: [err] })
                            });
                        }));
                    }
                    else if (req.fileValidationError) {
                        return utils_1.cdg.api(res, new Promise((resolve) => {
                            resolve({
                                status: 401,
                                message: 'error',
                                data: utils_1.cdg.buildApiError({ msg: req.fileValidationError })
                            });
                        }));
                    }
                    else if (err) {
                        return utils_1.cdg.api(res, new Promise((resolve) => {
                            resolve({
                                status: 401,
                                message: 'error',
                                data: utils_1.cdg.buildApiError({ msg: err.message })
                            });
                        }));
                    }
                }
                else {
                    req.file = '';
                }
                next();
            });
        });
    }
    static multiple(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            yield MulterMiddleware.buildUploadPath();
            let allowedExtension = ['jpg', 'jpeg', 'png'];
            const upload = multer_1.default({
                dest: MulterMiddleware.uploadPathTmp,
                fileFilter: (req, file, cb) => {
                    if (!utils_1.cdg.inArray(MulterMiddleware.buildExt(file.mimetype), allowedExtension)) {
                        req.fileValidationError = 'Type de fichier non autorisé';
                        return utils_1.cdg.api(res, new Promise((resolve) => {
                            resolve({
                                status: 422,
                                message: 'error',
                                data: utils_1.cdg.buildApiError({ msg: 'Type de fichier non autorisé' })
                            });
                        }));
                    }
                    cb(null, true);
                }
            }).array("file");
            upload(req, res, function (err) {
                if (req.file) {
                    if (err instanceof multer_1.default.MulterError) {
                        if (err.code === 'LIMIT_FILE_SIZE') {
                            err.message = "Fichier trop volumineux";
                        }
                        else if (err.code === 'LIMIT_FILE_COUNT') {
                            err.message = "Nombre maximum de fichier atteint";
                        }
                        return utils_1.cdg.api(res, new Promise((resolve) => {
                            resolve({
                                status: 401,
                                message: 'error',
                                data: utils_1.cdg.buildApiError({ msg: [err] })
                            });
                        }));
                    }
                    else if (req.fileValidationError) {
                        return utils_1.cdg.api(res, new Promise((resolve) => {
                            resolve({
                                status: 401,
                                message: 'error',
                                data: utils_1.cdg.buildApiError({ msg: req.fileValidationError })
                            });
                        }));
                    }
                    else if (err) {
                        return utils_1.cdg.api(res, new Promise((resolve) => {
                            resolve({
                                status: 401,
                                message: 'error',
                                data: utils_1.cdg.buildApiError({ msg: err.message })
                            });
                        }));
                    }
                }
                else {
                    req.file = '';
                }
                next();
            });
        });
    }
    static save(file) {
        return new Promise((resolve, reject) => {
            const tempPath = file.path;
            let fileExt = MulterMiddleware.buildExt(file.mimetype);
            let fullFilePath = MulterMiddleware.uploadPath + file.filename + '.' + fileExt;
            fs_1.default.rename(tempPath, fullFilePath, err => {
                if (err)
                    resolve({ status: 1, data: err });
                if (utils_1.cdg.file.exists(tempPath)) {
                    fs_1.default.rmdirSync(tempPath);
                }
                resolve({ status: 0, data: fullFilePath });
            });
        });
    }
    static buildExt(mimetype) {
        return mime_types_1.default.extension(mimetype);
    }
    static buildUploadPath() {
        return __awaiter(this, void 0, void 0, function* () {
            // CREATE TEMPORY UPLOAD PATH
            if (!fs_1.default.existsSync(this.uploadPathTmp)) {
                yield fs_1.default.promises.mkdir(this.uploadPathTmp, { recursive: true });
            }
            // CREATE UPLOAD PATH
            if (!fs_1.default.existsSync(this.uploadPath)) {
                yield fs_1.default.promises.mkdir(this.uploadPath, { recursive: true });
            }
        });
    }
}
exports.MulterMiddleware = MulterMiddleware;
MulterMiddleware.uploadPathTmp = path_1.default.join(utils_1.cdg.root() + process.env.UPLOAD_TMP_PATH);
MulterMiddleware.uploadPath = path_1.default.join(utils_1.cdg.root() + process.env.UPLOAD_PATH);
