import express from 'express';
import { comentController } from '../controllers/comentsC.mjs';
import { tokens } from '../secure/JWTs.mjs';

export const comentsRouter = express.Router()
comentsRouter.get('/', comentController.getALL) 
comentsRouter.get('/:id', comentController.getByID)
comentsRouter.post('/', comentController.postComent)
comentsRouter.patch('/:id', comentController.comentPatch) 
comentsRouter.delete('/:id', tokens.JWTverifyAdmin, comentController.comentDelete)

  