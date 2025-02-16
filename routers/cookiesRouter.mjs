import express from 'express';
import { cookiesController } from '../controllers/cookiesController.mjs';

export const setCookieRouter = express.Router()
setCookieRouter.post('/', cookiesController.setCookie)
setCookieRouter.get('/:cookieId', cookiesController.cookieVerification)
setCookieRouter.delete('/:cookieId', cookiesController.cookieDelete)