import express from 'express';
import 'express-async-errors';
import dotenv from 'dotenv';
import cors from 'cors';
import { CardsRouter } from './routers/CardsRouter.js';
import { SalesRouter } from './routers/SalesRouter.js';
import { RechargesRouter } from './routers/RechargesRouter.js';
import errorHandler from './middlewares/ErrorHandler.js';
dotenv.config()

const server = express();
server.use(cors());
server.use(express.json());

server.use(CardsRouter);
server.use(SalesRouter);
server.use(RechargesRouter);
server.use(errorHandler);

const PORT = process.env.PORT;
server.listen(PORT, () => {
    console.log(`It's alive on port ${PORT}`);
})