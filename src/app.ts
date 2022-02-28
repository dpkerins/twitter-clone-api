import express, { Application, Request, Response, NextFunction } from "express";
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const app: Application = express();

app.get('/', (req: Request, res: Response) => {
  res.send('This is a different message.');
});

app.get('/tweets/', async (req: Request, res: Response) => {
  const tweets = await prisma.tweet.findMany();
  res.json(tweets)
  // res.send('This is a tweet message.');
})

app.listen(5000, () => {
  console.log('Server is running');
})