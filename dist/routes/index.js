"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const router = express_1.default.Router();
router.get('/', (req, res) => {
    res.send('This is a different message.');
});
router.get('/tweets/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tweets = yield prisma.tweet.findMany({
        include: {
            likes: true
        }
    });
    res.json(tweets);
}));
router.post('/tweets/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const data = {
        content: body.content,
        author: {
            connect: {
                id: parseInt(body.userId)
            }
        }
    };
    const newTweet = yield prisma.tweet.create({
        data: data
    });
    res.json(newTweet);
}));
router.put('/tweets/:tweet_id/likes/:user_id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1].split('=')[1];
    const tokenVerify = yield prisma.session.findUnique({
        where: {
            sessionId: token
        }
    });
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
        const newLike = yield prisma.like.create({
            data: data
        });
        res.json(newLike);
    }
}));
router.post('/users/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const data = {
        email: body.email,
        name: body.name,
        password: body.password
    };
    const newUser = yield prisma.user.create({
        data: data
    });
    res.json(newUser);
}));
router.post('/sessions/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sessionId = () => {
        return '_' + Math.random().toString(36).substr(2, 9);
    };
    const body = req.body;
    const user = yield prisma.user.findUnique({
        where: {
            email: body.email,
        },
    });
    if (user && user.password == body.password) {
        const data = {
            sessionId: sessionId(),
            user: {
                connect: {
                    id: parseInt(user.id)
                }
            }
        };
        const newSession = yield prisma.session.create({
            data: data
        });
        res.json(newSession);
    }
}));
exports.default = router;
