import multer from 'multer'
import path from "path"
import fs from "fs"
import mime from 'mime-types'
import {cdg, config} from '../../utils'

// NATS SERVER
interface File {
    path: string,
    mimetype: string,
    filename: string,
    originalname: string,
    encoding: string,
    destination: string,
    size: number,
}

export class MulterMiddleware {
    static uploadPathTmp: any = path.join(cdg.root() + process.env.UPLOAD_TMP_PATH);
    static uploadPath: any = path.join(cdg.root() + process.env.UPLOAD_PATH);

    static async single(req: any, res: any, next:any) {
        await MulterMiddleware.buildUploadPath();
        let allowedExtension = ['jpg', 'jpeg', 'png'];
        const upload = multer({
            dest: MulterMiddleware.uploadPathTmp,
            fileFilter: (req:any, file:any, cb:any) => {
                if (!cdg.inArray(MulterMiddleware.buildExt(file.mimetype), allowedExtension)) {
                    req.fileValidationError = 'Type de fichier non autorisé';
                    return cdg.api(res, new Promise((resolve)=>{
                        resolve({
                            status: 422,
                            message: 'error',
                            data: cdg.buildApiError({msg: 'Type de fichier non autorisé'})
                        });
                    }));
                }
                cb(null, true);
            }
        }).single("file");

        upload(req, res, function (err: any) {
            if(req.file) {
                if (err instanceof multer.MulterError) {
                    if(err.code === 'LIMIT_FILE_SIZE') {
                        err.message = "Fichier trop volumineux"
                    } else if (err.code === 'LIMIT_FILE_COUNT') {
                        err.message = "Nombre maximum de fichier atteint"
                    }
                    return cdg.api(res, new Promise((resolve)=>{
                        resolve({
                            status: 401,
                            message: 'error',
                            data: cdg.buildApiError({msg: [err]})
                        });
                    }));
                } else if(req.fileValidationError) {
                    return cdg.api(res, new Promise((resolve)=>{
                        resolve({
                            status: 401,
                            message: 'error',
                            data: cdg.buildApiError({msg: req.fileValidationError})
                        });
                    }));
                } else if (err) {
                    return cdg.api(res, new Promise((resolve)=>{
                        resolve({
                            status: 401,
                            message: 'error',
                            data: cdg.buildApiError({msg: err.message})
                        });
                    }));
                }
            } else {
                req.file = '';
            }

            next()
        })
    }

    static async multiple(req: any, res: any, next:any) {
        await MulterMiddleware.buildUploadPath();
        let allowedExtension = ['jpg', 'jpeg', 'png'];
        const upload = multer({
            dest: MulterMiddleware.uploadPathTmp,
            fileFilter: (req:any, file:any, cb:any) => {
                if (!cdg.inArray(MulterMiddleware.buildExt(file.mimetype), allowedExtension)) {
                    req.fileValidationError = 'Type de fichier non autorisé';
                    return cdg.api(res, new Promise((resolve)=>{
                        resolve({
                            status: 422,
                            message: 'error',
                            data: cdg.buildApiError({msg: 'Type de fichier non autorisé'})
                        });
                    }));
                }
                cb(null, true);
            }
        }).array("file");

        upload(req, res, function (err: any) {
            if(req.file) {
                if (err instanceof multer.MulterError) {
                    if(err.code === 'LIMIT_FILE_SIZE') {
                        err.message = "Fichier trop volumineux"
                    } else if (err.code === 'LIMIT_FILE_COUNT') {
                        err.message = "Nombre maximum de fichier atteint"
                    }
                    return cdg.api(res, new Promise((resolve)=>{
                        resolve({
                            status: 401,
                            message: 'error',
                            data: cdg.buildApiError({msg: [err]})
                        });
                    }));
                } else if(req.fileValidationError) {
                    return cdg.api(res, new Promise((resolve)=>{
                        resolve({
                            status: 401,
                            message: 'error',
                            data: cdg.buildApiError({msg: req.fileValidationError})
                        });
                    }));
                } else if (err) {
                    return cdg.api(res, new Promise((resolve)=>{
                        resolve({
                            status: 401,
                            message: 'error',
                            data: cdg.buildApiError({msg: err.message})
                        });
                    }));
                }
            } else {
                req.file = '';
            }

            next()
        })
    }


    static save(file: File) {
        return new Promise((resolve, reject) => {
            const tempPath = file.path;
            let fileExt = MulterMiddleware.buildExt(file.mimetype);
            let fullFilePath = MulterMiddleware.uploadPath + file.filename + '.' + fileExt;

            fs.rename(tempPath, fullFilePath, err => {
                if (err) resolve({status: 1, data: err});
    
                if(cdg.file.exists(tempPath)) {
                    fs.rmdirSync(tempPath);
                }
                resolve({status: 0, data: fullFilePath})
            });
        })
    }
    static buildExt(mimetype: string) {
        return mime.extension(mimetype);
    }
    static async buildUploadPath() {
        // CREATE TEMPORY UPLOAD PATH
        if (!fs.existsSync(this.uploadPathTmp)) {
            await fs.promises.mkdir(this.uploadPathTmp, { recursive: true })
        }
        // CREATE UPLOAD PATH
        if (!fs.existsSync(this.uploadPath)) {
            await fs.promises.mkdir(this.uploadPath, { recursive: true })
        }
    }
}
