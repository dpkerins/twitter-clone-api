import express, { Application, Request, Response, NextFunction } from "express";
import router from './routes';

const app: Application = express();

app.use(express.json());
app.use("/", router)

export default app;