import express from 'express';
import { blangymController } from '../controllers/blangymController.mjs';

export const blangymRouter = express.Router()
blangymRouter.post('/', blangymController.gymPost)
blangymRouter.get('/', blangymController.gymGet)
blangymRouter.delete('/:exerciseId', blangymController.gymDelete)
