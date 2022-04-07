
import dotenv from 'dotenv';
dotenv.config();
export const config = {
    server: {
        port: process.env.SERVER_PORT,
        apiPath: process.env.API_PATH
    },
    mongo:{
        uri: process.env.DB_URI,
        name: process.env.DB_NAME, // Can be replaced by String
    },
    jwt:{
        secret: process.env.JWT_SECRET,
        public: process.env.JWT_PUBLIC
    },
    auth:{
        secret: process.env.AUTH_SECRET,
        public: process.env.AUTH_PUBLIC,
        key: process.env.AUTH_KEY
    }

};

