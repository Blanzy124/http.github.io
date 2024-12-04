import http from 'node:http';

const server = http.createServer((req, res) => {
 console.log(`request resivida`)
 if (req.url === '/'){
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/plane; charset=utf-8')
  res.end('<h1>HOLA QUE TAL</h1>')
 }
})
 


server.listen(0, () => {
 console.log(`se escucha el puerto http://localhost:${server.address().port}`)
})



