import { WebSocketServer, WebSocket } from 'ws';
import { WebSokeckE } from '../wstest.mjs';



export class chatRouter{
  static chatR(wss, req, socked, head){
    const { pathname } = new URL(req.url, `https://${req.headers.host}`)
    if(pathname === '/foo'){
      wss.handleUpgrade(req, socked, head, (ws) =>  {
        wss.emit('connection', ws, req)
      });
    }
    else{socked.destroy()}
  }
}
