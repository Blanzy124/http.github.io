import http from 'node:http';
import fs from 'node:fs'

const server = http.createServer((req, res) => {
 console.log(`request resivida`)
 if (req.url === '/'){
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/plane; charset=utf-8')
  res.end('HOLA QUE TAL')
 }
 else if (req.url === '/senna'){
  fs.readFile('./images_test/ssenna.png', (err, ima) => {
   if (err) {
    res.statusCode = 500
    res.end('algo salio mal')
   }
   else {
    res.statusCode = 200
    res.setHeader('Content-Type', 'image/png')
    res.end(ima)
   }
  })
 }
})
 


server.listen(0, () => {
 console.log(`se escucha el puerto http://localhost:${server.address().port}`)
})


