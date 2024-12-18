import http from 'node:http';
import fs from 'node:fs'
import path from 'node:path';
import express from 'express';
import { fileURLToPath } from 'url';
import name from './package.json' assert { type: 'json' };
import { createComentHttp } from './createHttp.mjs';

const app = express()
app.disable('x-powered-by')
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const comentsFile = path.join('.', 'users', 'Samuel', '12-3-2024- 9-07-17 PM.txt')
const PORT = process.env.PORT ?? 1234
const pathimage = path.join(__dirname, 'images_test/ssenna.png')

app.get('/', (req, res) => {

 res.set('Content-Type', 'image/png')
 res.sendFile(pathimage)
 console.log(`request send`)
})

app.get('/coments', (req, res) => {

 fs.readFile(comentsFile, 'utf-8', (err, coment) => {
  if (err){
   res.status(404)
   res.set('Content-Type', 'text/html')
   res.end('<h1>Sometings bad</h1>')
  }
  else{
   res.set('Content-Type', 'text/html')
   res.end(coment)
   console.log(`request send`)

  }
 })
})

app.get('/jsonProperty', (req, res) => {
 res.json(name)
})

app.post('/newComment', (req, res) => {
 let body = '';

 req.on('data', chunk => {
  body += chunk.toString()
 })

 req.on('end', () => {
  createComentHttp(body)
 })
})

app.use((req, res) => {
 res.status(404).send('<h1>404</h1>')
})


app.listen(PORT, () => {
 console.log(`escuchando a http://localhost:${PORT}`)
})
 