import express from 'express';
import { comentSchema, comentSchemmaPartial } from '../schemas/comentsSchemas.mjs';
import { comentModel } from '../models/mysql/coments.mjs';
//import { comentModel } from '../models/local_files/coment.mjs';

export class comentController {
 static async getALL (req, res ) {
  const { name } = req.query
  const { age } = req.query
  const coment = await comentModel.getALL({ name,  age})
  res.json(coment)
  }
 static async getByID (req, res ) {
  const { id } = req.params; 
  const coment = await comentModel.getByID({ id })
  res.json(coment)
 }
 static async postComent (req, res) {
  const result = comentSchema(req.body)
  if (result.error){
   return res.status(400).json({ error: JSON.parse(result.error.message)})
  }

  const coment = await comentModel.postComent({ result: result.data })
  res.json(coment).status(201)
 }

 static async comentPatch (req, res) {
  const restultP = comentSchemmaPartial(req.body)
  if(restultP.error){ 
   return res.status(400).json([{ 
    message: "Coment not found"
  }])}

  const { id } = req.params
  const coment = await comentModel.comentPatch({ id, restultP })

 res.json(coment)
 }
 static async comentDelete (req, res) {
  const { id } = req.params;
  const coment = await comentModel.comentDelete({ id })
  res.json(coment)
 }
}