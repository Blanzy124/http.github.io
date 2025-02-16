import mysql from 'mysql2/promise'; 
import { pool } from '../../configConecctionDB.mjs';

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
     values ('${userNameCookie}', '${cookieDate}');`
   )
   if(cookie.affectedRows > 0){
    [ cookie ] = await conection.query(
     `select bin_to_uuid(cookieId) from comentsDB.cookies where cookieDate = '${cookieDate}';`
    )

    return cookie
   }
  }catch(err){
    console.error(err);
    console.log(userNameCookie, 'modelo llegada')
   let cookie = { "message": "Cookie creation error, maybe cookie name do not match an user name"}
   return cookie
  }
 }

 static async cookieVerification({ cookieId }){
  await verifyConection();
  if (!conection) {
    throw new Error('No se pudo establecer la conexión con la base de datos');
  }
  try{
  let [cookieV] = await conection.query(`
    select userNameCookie from comentsDB.cookies where cookieId = uuid_to_bin('${cookieId}');`)
   console.log(cookieV[0].userNameCookie, 'model')
   return cookieV = { message: "true", userName: `${cookieV[0].userNameCookie}`}

  }catch(error){
    let cookieV = { message: "false"}
    console.log(error, 'error modelo query')
    return cookieV

  }
 }

 static async cookieDelete({ cookieId }){
  await verifyConection();
  if (!conection) {
    throw new Error('No se pudo establecer la conexión con la base de datos');
  }
  try{
    let [deleteCookie] = await conection.query(`
      delete from comentsDB.cookies where cookieId = uuid_to_bin('${cookieId}')
      `)
      if(deleteCookie.affectedRows >= 1){
        return { message: "Cookie Has Been Delete"}
      }
      else{
        return { message: "Cookie Id Do Not exist"}
      }
  }catch(err){
    console.error('Delete comente error', err)
    return { message: "Cookie Delete error"}
  }
 }
}
