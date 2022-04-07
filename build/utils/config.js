"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
    server: {
        port: process.env.SERVER_PORT,
        apiPath: process.env.API_PATH
    },
    mongo: {
        uri: process.env.DB_URI,
        name: process.env.DB_NAME, // Can be replaced by String
    },
    jwt: {
        secret: process.env.JWT_SECRET,
        public: process.env.JWT_PUBLIC
    },
    auth: {
        secret: process.env.AUTH_SECRET,
        public: process.env.AUTH_PUBLIC,
        key: process.env.AUTH_KEY
    }
};
