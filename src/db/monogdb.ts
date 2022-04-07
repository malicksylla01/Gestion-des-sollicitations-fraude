import {connect} from 'mongoose';
import {cdg} from '../utils';

export class Mongoose {
    static uri : string;
    static successMessage : string;
    static options : Object;
    constructor(uri: string, successMessage?: string) {
        (successMessage ? Mongoose.successMessage = successMessage : Mongoose.successMessage = 'MongoDB connected successfully!')
        Mongoose.uri = uri;
        Mongoose.options = {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        }
    }
    connect (callback: any) {
        connect(Mongoose.uri, Mongoose.options).then(() => {
            return callback({status: 0, data: Mongoose.successMessage})
        }).catch((err: any) => {
            cdg.konsole("database error::", err);
            return callback({status: 1, data: err});
        });
    }
}

