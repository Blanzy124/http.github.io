import express from 'express';
import https from 'https';
import fs from 'node:fs';
import cookieParser from 'cookie-parser';
//import { corsMiddleware } from './midleware/cors.mjs';
import { comentsRouter } from './routers/comentsRouter.mjs';
import { raizRouter } from './routers/raizRauter.mjs';
import { usersRouter } from './routers/usersRouter.mjs';
import { setCookieRouter } from './routers/cookiesRouter.mjs';
import { blangymRouter } from './routers/blangymRouter.mjs';
const app = express()

app.use(express.json());
app.use(cookieParser())
//corsMiddleware();
app.use((req, res, next) => {
 const allowedOrigins = ['http://127.0.0.1:3000', 'http://localhost:8443/','https://blanzynetwork.com', 'https://152.67.231.147', 'https://www.blanzynetwork.com'];
 const origin = req.headers.origin;
 if (allowedOrigins.includes(origin)) {
   res.header('Access-Control-Allow-Origin', origin);
 }
 res.header('Access-Control-Allow-Credentials', 'true');
 res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
 res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
 next();
});

app.use('/', raizRouter);
app.use('/coments', comentsRouter);
app.use('/users', usersRouter);
app.use('/setcookie', setCookieRouter)
app.use('/blangym', blangymRouter)


const options = {
  key: fs.readFileSync('./pems/apikey.pem'),
  cert: fs.readFileSync('./pems/apicert.pem')
};
const server = https.createServer(options, app);

const PORT = 8443;

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor API HTTPS corriendo en todas las interfaces y https://localhost:${PORT}`);
});

//app.listen(PORT, '0.0.0.0', () => {
// console.log(`escuchando a http://localhost:${PORT}`)
//})
