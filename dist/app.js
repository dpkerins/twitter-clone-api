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
const app = (0, express_1.default)();
app.get('/', (req, res) => {
    res.send('This is a different message.');
});
app.get('/tweets/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tweets = yield prisma.tweet.findMany();
    res.json(tweets);
    // res.send('This is a tweet message.');
}));
app.listen(5000, () => {
    console.log('Server is running');
});
