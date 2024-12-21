import express from 'express';
import { comentController } from '../controllers/comentsC.mjs';

export const comentsRouter = express.Router()
comentsRouter.get('/', comentController.getALL) 
comentsRouter.get('/:id', comentController.getByID)
comentsRouter.post('/', comentController.postComent)
comentsRouter.patch('/:id', comentController.comentPatch) 
comentsRouter.delete('/:id', comentController.comentDelete)

  