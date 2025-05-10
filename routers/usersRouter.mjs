import express from 'express';
import { usersController } from '../controllers/usersController.mjs';
export const usersRouter = express.Router()
usersRouter.post('/login', usersController.logIn)
usersRouter.post('/create', usersController.createNewUser)