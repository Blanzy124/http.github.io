import express from 'express';
import { blangymController } from '../controllers/blangymController.mjs';
import { tokens } from '../secure/JWTs.mjs';
export const blangymRouter = express.Router();
blangymRouter.post('/', tokens.JWTverify, blangymController.gymPost)
blangymRouter.get('/', tokens.JWTverify, blangymController.gymGet)
blangymRouter.delete('/:exerciseId', tokens.JWTverify, blangymController.gymDelete)
