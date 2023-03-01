import express from 'express';
import morgan from 'morgan';
import config from './config';
import charactersRouter from './routers/characters-router';
import { connectMySql } from './services/my-sql';

const server = express();

// Middlewares
server.use(morgan('tiny'));
server.use(express.static('public'));
server.use(express.json());
server.use('/api/characters', charactersRouter);

connectMySql(() => {
  server.listen(config.server.port, () => {
    console.log(`server is running on: http://${config.server.domain}:${config.server.port}`);
  });
});
