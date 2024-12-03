import http from 'node:http';

const server = http.createServer((req, res) => {
 console.log(`request resivida`)
 res.end('hola que tal')
})
 


server.listen(0, () => {
 console.log(`se escucha el puerto http://localhost:${server.address().port}`)
})




