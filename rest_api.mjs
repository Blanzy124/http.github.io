import dotenv from 'dotenv';
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
import { emailsRouter } from './routers/emailsRouter.mjs';
import { tokensRouter } from './routers/tokensRouter.mjs';
import { tokens } from './secure/JWTs.mjs';
import { WebSokeckE } from './webSokeck/wstest.mjs';
import { chatRouter } from './webSokeck/routers/chatRauter.mjs';

import { WebSocketServer, WebSocket } from 'ws';

dotenv.config();
const c_cert = process.env.CLOUDFLARE_CERT;
const c_key = process.env.CLOUDFLARE_KEY;



const app = express()
app.use(express.json());
app.use(cookieParser())
//corsMiddleware();
app.use((req, res, next) => {
  const allowedOrigins = ['http://127.0.0.1:3000', 'http://localhost:8443','https://blanzynetwork.com', 'https://www.blanzynetwork.com', 'https://152.67.231.147', 'https://www.blanzynetwork.com', '*'];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

  if (req.method === 'OPTIONS') {
  return res.sendStatus(200);
  }
  next();
});

app.use('/', raizRouter);
app.use('/coments', comentsRouter);
app.use('/users', usersRouter);
app.use('/setcookie', setCookieRouter);
app.use('/tokens', tokensRouter)
app.use('/blangym', blangymRouter);
app.use('/email', emailsRouter);
const options = {
  key: c_key,
  cert: c_cert
};


const server = https.createServer(options, app);
const wss = new WebSocketServer({ noServer: true });
wss.on("connection", async (ws, req) => {

  const wsV = await tokens.JWTverifyWS(req);// THIS IS LIKE A GET FUNTION, RETURN A DATA OBJECT
  if(wsV.ok !== true){ ws.send(wsV.message); ws.close();}
  try{
    ws.userName = wsV.data.userName
    ws.userStatus = wsV.data.userStatus
  }catch(err){
    ws.close()
  }
  


  WebSokeckE.foo(ws, wss, wsV);

})
server.on('upgrade', function upgrade(req, socked, head) {
  socked.on('error', console.error)
  chatRouter.chatR(wss, req, socked, head);
})


const PORT = 8443;

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor API HTTPS corriendo en todas las interfaces y https://localhost:${PORT}`);
});

//app.listen(PORT, '0.0.0.0', () => {
// console.log(`escuchando a http://localhost:${PORT}`)
//})
