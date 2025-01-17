import express from 'express';
import { raizController } from '../controllers/raizController.mjs';

export const raizRouter = express.Router()
raizRouter.get('/', raizController.wellcome)
