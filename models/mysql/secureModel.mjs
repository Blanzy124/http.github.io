import e from 'express';
import { pool } from '../../serverSettings.mjs';
let conection;
async function verifyConection(retryCount = 3) {
   try {
     if (!conection || conection.connection._closing) {
       //console.log(conection, 'if 1');
       conection = await pool.getConnection();
       console.log('Connection established');
     }
   } catch (err) {
     console.error('Connection error', err);
     if (retryCount > 0) {
       console.log('Retrying connection...');
       await new Promise(res => setTimeout(res, 1000));
       return await verifyConection(retryCount - 1);
     } else {
       console.error('Failed to establish connection after retries');
       conection = null;
     }
   }
   return conection;
}

export class ddosSecure{

 static async saveBlockedIp({ip}){
  await verifyConection();
  if (!conection) {
   throw new Error('No se pudo establecer la conexión con la base de datos');
  }

  try{
   const [saveIp] = await conection.query(
    `insert into comentsDB.ips (blocked_ips) values (?)`, [ip]);
   if(saveIp.affectedRows > 0){
    
   }
  }catch(err){

  }

 }

}


 

 