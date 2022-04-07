"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mongoose = void 0;
const mongoose_1 = require("mongoose");
const utils_1 = require("../utils");
class Mongoose {
    constructor(uri, successMessage) {
        (successMessage ? Mongoose.successMessage = successMessage : Mongoose.successMessage = 'MongoDB connected successfully!');
        Mongoose.uri = uri;
        Mongoose.options = {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        };
    }
    connect(callback) {
        mongoose_1.connect(Mongoose.uri, Mongoose.options).then(() => {
            return callback({ status: 0, data: Mongoose.successMessage });
        }).catch((err) => {
            utils_1.cdg.konsole("database error::", err);
            return callback({ status: 1, data: err });
        });
    }
}
exports.Mongoose = Mongoose;
