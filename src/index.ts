import express from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import {cdg, config} from './utils';
import {Mongoose} from './db/monogdb';
import { setRoutes } from './routes/route.decorators';
import cors from 'cors';
import './routes';

const app = express();

app.use(helmet());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use((err:any, req:any, res:any, next:any) => {
    if ( err && err.status === 400 && 'body' in err) {
        return cdg.api(res, new Promise((resolve)=>{
            resolve({
                status: 400,
                message: 'Bad request',
                data: [err.type]
            });
        }));
    } 
    
    next();
});

setRoutes(app);

// 404 not found error handler
app.use((err:any, res:any) => {
    cdg.konsole('Enterring 404 error')
    return cdg.api(res, new Promise((resolve)=>{
        resolve({
            status: 404,
            message: 'Route introuvable ou inexistante',
            data: []
        });
    }));
});

app.listen(config.server.port, () => {
    cdg.konsole("Serveur connectée! :: " + config.server.port + "!");
    // Connection to mongodb database
    const uriDb = config.mongo.uri! + config.mongo.name! + '?authSource=admin';
    const db = new Mongoose(uriDb, 'MongoDB connecté!');
    db.connect((Q: any) => {
        if (Q.status === 0) {
            cdg.konsole(Q.data);
        } else {
            cdg.konsole(Q.data, 1);
        }
    });
});
