import express from 'express';
import { cookiesController } from '../controllers/cookiesController.mjs';

export const setCookieRouter = express.Router()
setCookieRouter.post('/', cookiesController.setCookie)