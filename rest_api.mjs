import express from 'express';
import crypto from 'node:crypto';
import path from 'node:path';
import fs from 'node:fs';
import coments from './users/coments.json'  assert { type: 'json' };
import { comentSchema } from './schemas/comentsSchemas.mjs';
import { comentSchemmaPartial } from './schemas/comentsSchemas.mjs';
import { error } from 'node:console';
const app = express()

const comentsPath = path.join('.', 'users', 'coments.json') 

app.use(express.json());

const ACEPTED_WEBS = [
 "http://localhost:1235/coments",
 "https://blanzy124.github.io"
]
app.get('/coments', (req, res ) => {
 const originWeb = req.header('origin')
 if(ACEPTED_WEBS.includes(originWeb)){
  res.header('Access-Control-Allow-Origin', originWeb)  

 }

 const { name } = req.query
 const { age } = req.query
 if (name) {
  const filterUserComents = coments.filter(
   coment => coment.name.toLowerCase().includes(name.toLowerCase())
  )  
  return res.json(filterUserComents)
 }
 if (age){
  const filterAgeComents = coments.filter(
   coment => coment.age == age
  )  
  return res.json(filterAgeComents)
 }
 else{
  console.log('peticion de todos los comentarios')
  res.send(coments)
 } 
 }
) 

app.get('/coments/:id', (req, res ) => {
 const { id } = req.params; 
 const coment = coments.find(coment => coment.id === id)
 if (coment) return res.json(coment)
 console.log(`request recieved id`)
})

app.get('/coments/user', (req, res ) => {
 res.send(coments)
 console.log(`request recieved`)
})

//////////////////////////////////////////////////////////////////

app.post('/coments', (req, res) => {
 const result = comentSchema(req.body)

 if (result.error){
  return res.status(400).json({ error: JSON.parse(result.error.message)})
 }

 const newComent = {
  id: crypto.randomUUID(),
  ...result.data
 }
 coments.push(newComent)
 fs.writeFile(comentsPath, JSON.stringify(coments, null, 2), 'utf-8', (err) => {
  if (err){return res.status(400).json([{ message: "Error, try again"}])}
  else {return res.status(201).json([{ message: "Coment sumited", newComent}])}
 })

 //console.log(newComent)

})

app.patch('/coments/:id', (req, res) => {
 const restultP = comentSchemmaPartial(req.body)
 if(restultP.error){ return res.status(400).json([{ message: "Coment not found"}])}
 
 const { id } = req.params
 const comentP = coments.findIndex(coment => coment.id === id)
 if(comentP === -1) {return res.status(400).json([{ message: "Coment not found"}])}
 
 const patchcoment = {...coments[comentP], ...restultP.data}

 res.status(201,).send(patchcoment)


}) 

const PORT = process.env.PORT ?? 1235

app.listen(PORT, () => {
 console.log(`escuchando a http://localhost:${PORT}`)
})