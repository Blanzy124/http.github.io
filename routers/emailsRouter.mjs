import express from 'express';
import { emailController } from '../controllers/emailsController.mjs';

export const emailsRouter = express.Router();
emailsRouter.post('/setcodeverification', emailController.codeVerification.setCodeVerification);
emailsRouter.post('/setemailverification', emailController.setEmailVerification);


