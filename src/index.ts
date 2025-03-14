import express from 'express'
import http from 'http'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import compression from 'compression'
import cors from 'cors'
import mongoose from 'mongoose'
import path from 'path'
import { PORT, MONGO_URI } from './utils/config'
import router from './routes/routes'

/// TODO INTENTAR EXTRAER ESTE FICHERO A UN CUSTOM.D.TS
declare module "express" {
  interface Request {
      user?: any;
  }
}

const app = express();

// middlewares
app.use(cors({
  credentials: true,
}));

// activar archivos estaticos y estilos
app.use(express.static(path.join(__dirname, "../client"))); // HTML
app.use('/css', express.static(path.join(__dirname, '../client')));

app.use(compression());
app.use(cookieParser()); // cookies
app.use(bodyParser.json());  // transforma req.boy a formato .json
app.use(bodyParser.urlencoded({ extended: true })); 
app.use('/', router());

const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});

mongoose.Promise = Promise;
mongoose.connect(MONGO_URI);
mongoose.connection.on('error', (error: Error) => console.log(error));



