import express, {Request, Response, } from "express"
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
  res.send('This is a different message.');
});

router.get('/tweets/', async (req: Request, res: Response) => {
  const tweets = await prisma.tweet.findMany({
    include: {
      likes: true
    }
  });
  res.json(tweets)
})

router.post('/tweets/', async (req: Request, res: Response) => {
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

router.put('/tweets/:tweet_id/likes/:user_id', async (req: Request, res: Response) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1].split('=')[1]
  const tokenVerify = await prisma.session.findUnique({
    where: {
      sessionId: token
    }
  })
  if (token == tokenVerify.sessionId) {
    const tweetId = req.params.tweet_id;
    const userId = req.params.user_id;
    const data = {
      id: `${tweetId}_${userId}`,
      user: {
        connect: {
          id: parseInt(userId)
        }
      },
      tweet: {
        connect: {
          id: parseInt(tweetId)
        }
      },
    };
    const newLike = await prisma.like.create({
      data: data
    });
    res.json(newLike);
  }
})

router.post('/users/', async (req: Request, res: Response) => {
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

router.post('/sessions/', async (req: Request, res: Response) => {
  const sessionId = () => {
    return '_' + Math.random().toString(36).substr(2, 9);
  };
  const body = req.body;
  const user = await prisma.user.findUnique({
    where: {
      email: body.email,
    },
  })
  if (user && user.password == body.password) {
    const data = {
      sessionId: sessionId(),
      user: {
      connect: {
          id: parseInt(user.id)
        }
      }
    };
    const newSession = await prisma.session.create({
      data: data
    });
    res.json(newSession);
  }
})

export default router;