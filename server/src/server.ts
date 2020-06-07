import express from 'express';
import cors from 'cors';
import routes from './routes'
import path from 'path';

const app = express();

app.use(express.json());

//limita as urls que podem acessar a api rest
app.use(cors());

app.use(routes);

app.use('/uploads', 
    express.static(path.resolve(__dirname, '..', 'uploads')));

app.listen(3333);
