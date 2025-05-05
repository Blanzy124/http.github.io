import { blangymModel } from "../models/mysql/blangymModel.mjs";
import { exerciseTrakerSchema } from "../schemas/blangymSchemas.mjs";

export class blangymController{
 static async gymPost( req, res ){
  const {userName} = req.query;
  const result = exerciseTrakerSchema(req.body);
  //console.log(result)
  if(!result.success){
   res.json({ error: JSON.parse(result.error.message)})
   return 
  }
  else{
   let response = await blangymModel.gymPost({ result: result.data, userName })
   res.json(response).status(201)
  }
 }
 static async gymGet( req, res ){
  const { userName } = req.query;
  const response = await blangymModel.gymGet({ userName })
  res.json(response).status(202)
 }
 static async gymDelete( req, res ){
  const {exerciseId} = req.params;
  let response = await blangymModel.gymDelete({ exerciseId })
  res.json(response)
 }
}

