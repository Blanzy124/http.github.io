import { WebSocketServer, WebSocket } from 'ws';
import express from 'express';
import { tokens } from '../secure/JWTs.mjs';
import { userModel } from '../models/mysql/usersModel.mjs';
import { date } from 'zod';



export class WebSokeckE {
 static async foo(ws, wss, wsV){
  ws.on('close', () => {
   console.log('User disconnected')
  })
  ws.on('message', (d) => {
   const data = JSON.parse(d.toString('utf8'))
   wss.clients.forEach(client => {
    if(data.to === client.userName){
     client.send(JSON.stringify(data));
    }
   });
   
   
   

   //wss.clients.forEach(client => {
    //if(client !== ws && client.readyState === WebSocket.OPEN) {
    // client.send(data);
    //}
   //});
  })
 }
}



