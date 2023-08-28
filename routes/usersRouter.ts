import express from 'express';
import { addUsers, getUsers } from '../models/usersModel';

const userRouter = express.Router();

userRouter.get('/', getUsers);
userRouter.post('/', addUsers);

export default userRouter;
