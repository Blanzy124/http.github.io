import mysql from 'mysql2/promise'; 
import { date } from 'zod';

//const config = {
//  host: 'localhost',
//  user: 'root',
//  port: 3306,
//  password: '',
//  database: 'comentsDB',
//}
//Mgee2005?

const pool = mysql.createPool({
  host: "localhost",      
  user: "root",           
  password: "Mgee2005?",  
  database: "comentsDB",  
  port: 3306,             
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true, 
  keepAliveInitialDelay: 10000
});
//Mgee2005?
let conection;

async function verifyConection(retryCount = 3) {
  try {
    if (!conection || conection.connection._closing) {
      console.log(conection, 'if 1');
      conection = await pool.getConnection();
      console.log('Connection established');
    }
  } catch (err) {
    console.error('Connection error', err);
    if (retryCount > 0) {
      console.log('Retrying connection...');
      await new Promise(res => setTimeout(res, 1000)); // Espera 1 segundo antes de reintentar
      return await verifyConection(retryCount - 1);
    } else {
      console.error('Failed to establish connection after retries');
      conection = null;
    }
  }
  return conection;
}

export class cookiesModel {
 static async setCookie ({ userNameCookie }){
  await verifyConection();
  if (!conection) {
    throw new Error('No se pudo establecer la conexión con la base de datos');
  }
  try{
   const cookieDate = new Date();
   let [ cookie ]  = await conection.query(
    `insert into comentsDB.cookies (userNameCookie, cookieDate)
     values ('${userNameCookie.userNameCookie}', '${cookieDate}');`
   )
   if(cookie.affectedRows > 0){
    [ cookie ] = await conection.query(
     `select bin_to_uuid(cookieId) from comentsDB.cookies where cookieDate = '${cookieDate}';`
    )
    //console.log(cookie[0]["bin_to_uuid(cookieId)"])
    return cookie
   }
  }catch(err){
   let cookie = { "message": "coment error, maybe cookie name do not match an user name"}
   return cookie
  }
  
 }
}
