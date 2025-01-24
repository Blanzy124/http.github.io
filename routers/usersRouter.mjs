import express from 'express';
import { usersController } from '../controllers/usersController.mjs';
export const usersRouter = express.Router()
usersRouter.get('/', usersController.getUser)