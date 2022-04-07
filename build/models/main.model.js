"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const clientSchema = new mongoose_1.default.Schema({
    nom: {
        type: String,
        required: false
    },
    prenoms: {
        type: String,
        required: false
    },
    numero_de_telephone: {
        type: String,
        required: true,
        minLength: 10,
        maxLength: 10
    },
    mail: {
        type: String,
        required: false
    },
    description: {
        type: String,
        required: true
    },
}, { timestamps: true });
/*
|--------------------------------------------
| ADDITIONAL SCHEMAS APPEAR HERE
|--------------------------------------------
*/
exports.User = mongoose_1.default.model("User", clientSchema);
clientSchema.path('_id');
