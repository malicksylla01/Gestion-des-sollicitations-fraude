import { User} from './main.model';
import { cdg } from '../utils/coddyger';

export class MainSet {
    static save( data: Object){
        return new Promise((resolve, reject) => {
            const Q = new User(data);
            
            Q.save(function(err: any) {
                if (err) resolve({ status: 400, data: err });

                resolve({ status: 201, data: 'Votre requête a bien été prise en compte' })
            });
        }).catch ((e: any) => {
            if (e) {
                cdg.konsole(e, 1);
                return { status: 1, data: e };
            }
        });;
    }

    static update(key: object, data: object) {
        return new Promise((resolve) => {
            let Q = User.updateOne(key, data, { upsert: true });
            Q.exec();
    
            resolve({ status: 0, data: "Data edited successfully" });
          }).catch ((e: any) => {
            if (e) {
                cdg.konsole(e, 1);
                return { status: 1, data: e };
            }
        });
    }

    static remove(slug: any) {
        return new Promise((resolve) => {
          User.deleteOne({ slug: slug }, function (err: any) {
            if (err) resolve({ status: 1, data: err });
            return resolve({
              status: 0,
              data: "Data removed successfully",
            });
          }).catch ((e: any) => {
                if (e) {
                    cdg.konsole(e, 1);
                    return { status: 1, data: e };
                }
            });
        });
    }

    static select(query: { params: any, excludes: any }) {
        query.params = (cdg.string.is_empty(query.params) ? {} : query.params);
        query.excludes = (cdg.string.is_empty(query.excludes) ? {} : query.excludes);

        return new Promise(async(resolve) => {
            let Q = await User.find(query.params, query.excludes).sort({ createdAt: '-1' }).lean()

            resolve(Q)
        }).catch ((e: any) => {
            if (e) {
                cdg.konsole(e, 1);
                return { status: 1, data: e };
            }
        });;
    }

    static selectOne(params: Object) {
        return new Promise(async(resolve) => {
            resolve(await User.findOne(params).select("-__v").lean());
        }).catch ((e: any) => {
            if (e) {
                cdg.konsole(e, 1);
                return { status: 1, data: e };
            }
        });
    }

    static exist(params: Object) {
        return new Promise(async(resolve) => {
            let Q = await User.findOne(params).select("-__v").lean();
            if (Q == null) {
              resolve(false);
            } else {
              resolve(true);
            }
        }).catch ((e: any) => {
            if (e) {
                cdg.konsole(e, 1);
                return { status: 1, data: e };
            }
        });;
    }

    static rollbackSave(slug: string) {
        return new Promise((resolve, reject) => {
            MainSet.remove(slug).then((remove: any) => {
                if(remove.status === 1 ) {
                    cdg.konsole(remove, 1);
                    resolve(false);
                }

                resolve(true)
            })
        })
    }
    static async ownData(params: object) {
        let Q = await User.findOne(params);
        return !!Q;
    }
}
