import mysql from 'mysql2/promise'; 
import { pool } from '../../configConecctionDB.mjs';
import { userModel } from './usersModel.mjs';
import { emailModel } from './emailsModel.mjs';

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
    `insert into comentsDB.cookies (userNameCookie, cookieDate) values (?, ?);`, [userNameCookie, cookieDate]) //XX
   if(cookie.affectedRows > 0){
    const [ cookieId ] = await conection.query(
     `select bin_to_uuid(cookieId) from comentsDB.cookies where cookieDate = ?;`, [cookieDate]) //XX
    return { message: "Cookie create", ok: true, data: {cookieId: cookieId[0]['bin_to_uuid(cookieId)']} } //XX
   }
   else{
    return { message: "Error creating cookie", errorCode: 302, ok: false} //XX
   }
  }catch(err){
    console.error("Error code : '303", err);
   return { message: "Error creating cookie", errorCode: 303, ok: false} //XX
  }
 }

 static async cookieVerification({ cookieId }){
  await verifyConection();
  if (!conection) {
    throw new Error('No se pudo establecer la conexión con la base de datos');
  }
  if(cookieId){
    try{
      const [cookieV] = await conection.query(`select userNameCookie from comentsDB.cookies where cookieId = uuid_to_bin(?);`, [cookieId]) //XX
      if(cookieV.length === 0){ return { message: "There is not cookie active", errorCode: 300, ok: false} }
      const userEmail = await emailModel.getUserEmail({ userName: cookieV[0].userNameCookie })

      if(userEmail.ok !== true){ return userEmail }

      const emailStatus = await emailModel.checkEmailStatus({ userEmail: userEmail.data.userEmail })
      if(emailStatus.ok !== true){ return emailStatus }
      else{
        return { message: "Cookie verifird", ok: true, data: {userName: cookieV[0].userNameCookie, cookieId} } //XX
      }
    }catch(error){
      console.error("Error code : '301'", error)
      return { message: "Error cookie verification", errorCode: 301, ok: false} //XX
  
    }
  }
  else{
    return { message: "Missing data", errorCode: 202, ok: false}
  }
 }

 static async cookieDelete({ cookieId }){
  await verifyConection();
  if (!conection) {
    throw new Error('No se pudo establecer la conexión con la base de datos');
  }
  try{
    let [deleteCookie] = await conection.query(`
      delete from comentsDB.cookies where cookieId = uuid_to_bin(?)`, [cookieId]) //XX
      if(deleteCookie.affectedRows >= 1){
        return { message: "Cookie Has Been Delete", ok: true} //XX
      }
      else{
        return { message: "Cookie Id Do Not exist", errorCode: 305, ok: false} //XX
      }
  }catch(err){
    console.error('Error Code: 304', err)
    return { message: "Cookie Delete error", errorCode: 304, ok: false} //XX
  }
}
}
