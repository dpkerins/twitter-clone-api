import express, { Application, Request, Response, NextFunction } from "express";
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const app: Application = express();

app.use(express.json());


app.listen(5000, () => {
  console.log('Server is running');
})

app.get('/', (req: Request, res: Response) => {
  res.send('This is a different message.');
});

app.get('/tweets/', async (req: Request, res: Response) => {
  const tweets = await prisma.tweet.findMany();
  res.json(tweets)
})

app.post('/tweets/', async (req: Request, res: Response) => {
  const body = req.body;
  const data = {
    content: body.content,
    author: {
      connect: {
          id: parseInt(body.userId)
        }
      }
    };
  const newTweet = await prisma.tweet.create({
    data: data
  });
  res.json(newTweet);
})

app.post('/users/', async (req: Request, res: Response) => {
  const body = req.body;
  const data = {
    email: body.email,
    name: body.name,
    password: body.password
  };
  const newUser = await prisma.user.create({
    data: data
  });
  res.json(newUser);
})