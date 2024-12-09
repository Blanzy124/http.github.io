import express from 'express';
import fs from 'node:fs';
import coments from './users/coments.json'  assert { type: 'json' };

const app = express()

const PORT = process.env.PORT ?? 1235



app.get('/coments', (req, res ) => {
 const { name } = req.query
 if (name) {
  const filterUserComents = coments.filter(
   coment => coment.name.toLowerCase().includes(name.toLowerCase())
  )  
  return res.json(filterUserComents)
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



app.post('/addcoment', (req, res) => {
 let body = ''
 req.on('data', chunk => {
  body += chunk.toString()
  console.log(`request recieved coment`)
  
 })
 req.on('end', () => {
  const data = JSON.parse(body)
  console.log(data)
  res.set('Content-Type', 'application/json')
  res.send(data)
 })
})

app.listen(PORT, () => {
 console.log(`escuchando a http://localhost:${PORT}`)
})
 