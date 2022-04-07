import {MainSet} from '../../models';
import {XlsxHelper} from '../../helpers';
import {Constants} from '../../config';
import {cdg} from '../../utils';
import { JwtMiddleware } from '../middlewares';

interface Define {
    existMessage: string,
    notFoundMessage: string,
    successSaveMessage: string,
    successUpdateMessage: string,
    removeMessage: string,
    unknowCategoryMessage: string,
    failedAuthMessage: string,
}

let defines: Define = {
    existMessage: 'Un enregistrement avec ce titre existe déjà',
    notFoundMessage: 'Objet introuvable',
    successSaveMessage: 'Authentification éffectuée avec succès',
    successUpdateMessage: 'Article modifié avec succès',
    removeMessage: 'Article supprimé avec succès',
    unknowCategoryMessage: 'Categorie de publication inconnue',
    failedAuthMessage: 'Echèc d\'authentification API',
}

export class MainController {
    static save(payload : {
        apikey: string,
    }) {
        return new Promise((resolve, reject) => {
            // GENERATE UNIQ ID FOR CURRENT SAVE
            let slug = cdg.generateSlug()
            let apikey = payload.apikey; //

            if(!cdg.inArray(apikey, Constants.apiKeys)) {
                resolve({
                    status: 422,
                    message: defines.failedAuthMessage,
                    data: cdg.buildApiError({value: apikey, msg: defines.failedAuthMessage})
                })
            } else {
                JwtMiddleware.generateAccessToken({infinite: false}).then((generate: any) => {
                    if(generate.error) {
                        resolve({
                            status: 500,
                            message: Constants.error500message,
                            data: generate.data
                        });
                    }
                    // SAVE GENERATED TOKEN INTO DB
                    MainSet.save({slug: slug, token: generate}).then(async(save: any) => {
                        if(save.status === 1) {
                            // LOGGER
                            cdg.konsole(save, 1)
                            MainSet.rollbackSave(slug)
                            resolve({
                                status: 500,
                                message: Constants.error500message,
                                data: save
                            });
                        } else {
                            let record:any = await MainSet.selectOne({slug: slug});

                            resolve({
                                status: 200,
                                message: defines.successSaveMessage,
                                data: record.token
                            });
                        }
                    });
                })
            }
        })
    }
    static remove(payload : {
        slug: string
    }) {
        return new Promise((resolve, reject) => {
            // GENERATE UNIQ ID FOR CURRENT SAVE
            let slug = payload.slug

            // CHECK ITEM EXISTENCE
            MainSet.exist({slug: payload.slug}).then(async (exit) => {
                if(!exit) {
                    resolve({
                        status: 422,
                        message: 'error',
                        data: cdg.buildApiError({value: slug, msg: defines.notFoundMessage})
                    });
                } else {
                    MainSet.remove(slug).then((remove: any) => {
                        if(remove.status === 1) {

                        } else {
                            resolve({
                                status: 200,
                                message: 'OK',
                                data: defines.removeMessage
                            });
                        }
                    })
                }
            })
        })
    }
    static select(payload?: string) {
        return new Promise(async(resolve, reject) => {
            if(!cdg.string.is_empty(payload)) {
                MainSet.selectOne({slug: payload}).then((data: any) => {
                    if(data) {
                        resolve({
                            status: 200,
                            message: 'ok',
                            data: data
                        })
                    } else {
                        resolve({
                            status: 422,
                            message: defines.notFoundMessage,
                            data: {}
                        })
                    }
                });
            } else {
                let Q:any = await MainSet.select({params: {}, excludes: {}})
                let global: any = []
                if(Q) {
                    Q.forEach((item: any) => {
                        global.push(item)
                    });
                    resolve({
                        status: 200,
                        message: 'ok',
                        data: global
                    })
                } else {
                    resolve({
                        status: 500,
                        message: Constants.error500message,
                        data: Q
                    })
                }
            }
        })
    }
}
