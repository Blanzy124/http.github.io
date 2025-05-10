import express, { Router } from 'express'; 
import { tokensController } from '../controllers/tokensController.mjs';

export const tokensRouter = express.Router();
tokensRouter.post('/jwtrefresh', tokensController.JWTrefresh)
