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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainSet = void 0;
const main_model_1 = require("./main.model");
const coddyger_1 = require("../utils/coddyger");
class MainSet {
    static save(data) {
        return new Promise((resolve, reject) => {
            const Q = new main_model_1.User(data);
            Q.save(function (err) {
                if (err)
                    resolve({ status: 400, data: err });
                resolve({ status: 201, data: 'Votre requête a bien été prise en compte' });
            });
        }).catch((e) => {
            if (e) {
                coddyger_1.cdg.konsole(e, 1);
                return { status: 1, data: e };
            }
        });
        ;
    }
    static update(key, data) {
        return new Promise((resolve) => {
            let Q = main_model_1.User.updateOne(key, data, { upsert: true });
            Q.exec();
            resolve({ status: 0, data: "Data edited successfully" });
        }).catch((e) => {
            if (e) {
                coddyger_1.cdg.konsole(e, 1);
                return { status: 1, data: e };
            }
        });
    }
    static remove(slug) {
        return new Promise((resolve) => {
            main_model_1.User.deleteOne({ slug: slug }, function (err) {
                if (err)
                    resolve({ status: 1, data: err });
                return resolve({
                    status: 0,
                    data: "Data removed successfully",
                });
            }).catch((e) => {
                if (e) {
                    coddyger_1.cdg.konsole(e, 1);
                    return { status: 1, data: e };
                }
            });
        });
    }
    static select(query) {
        query.params = (coddyger_1.cdg.string.is_empty(query.params) ? {} : query.params);
        query.excludes = (coddyger_1.cdg.string.is_empty(query.excludes) ? {} : query.excludes);
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            let Q = yield main_model_1.User.find(query.params, query.excludes).sort({ createdAt: '-1' }).lean();
            resolve(Q);
        })).catch((e) => {
            if (e) {
                coddyger_1.cdg.konsole(e, 1);
                return { status: 1, data: e };
            }
        });
        ;
    }
    static selectOne(params) {
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            resolve(yield main_model_1.User.findOne(params).select("-__v").lean());
        })).catch((e) => {
            if (e) {
                coddyger_1.cdg.konsole(e, 1);
                return { status: 1, data: e };
            }
        });
    }
    static exist(params) {
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            let Q = yield main_model_1.User.findOne(params).select("-__v").lean();
            if (Q == null) {
                resolve(false);
            }
            else {
                resolve(true);
            }
        })).catch((e) => {
            if (e) {
                coddyger_1.cdg.konsole(e, 1);
                return { status: 1, data: e };
            }
        });
        ;
    }
    static rollbackSave(slug) {
        return new Promise((resolve, reject) => {
            MainSet.remove(slug).then((remove) => {
                if (remove.status === 1) {
                    coddyger_1.cdg.konsole(remove, 1);
                    resolve(false);
                }
                resolve(true);
            });
        });
    }
    static ownData(params) {
        return __awaiter(this, void 0, void 0, function* () {
            let Q = yield main_model_1.User.findOne(params);
            return !!Q;
        });
    }
}
exports.MainSet = MainSet;
