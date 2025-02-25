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
       await new Promise(res => setTimeout(res, 1000));
       return await verifyConection(retryCount - 1);
     } else {
       console.error('Failed to establish connection after retries');
       conection = null;
     }
   }
   return conection;
 }

export class userModel {
 static async getUser ({ name, userPassword }) {
  await verifyConection();
  if (!conection) {
    throw new Error('No se pudo establecer la conexión con la base de datos');
  }
  if(name && userPassword){
   var [user] = await conection.query(
    `select name, userStatus from comentsDB.users where name = '${name}' and userPassword = '${userPassword}';`
   )
   if(user.length === 0){
     user  = { "message": "User do not exit, wrong user name or password" }
    return user
   }
   return user
  }
 }

 static async createNewUser ( { result }){
  await verifyConection();
  if (!conection) {
    throw new Error('No se pudo establecer la conexión con la base de datos');
  }
  
  try{
    const [createUser] = await conection.query(`
      insert into comentsDB.users (name, userPassword, userStatus)
      values ('${result.name}','${result.userPassword}', 'user');
      `)
      if(createUser.affectedRows > 0){
        return { message: "User has been create", ok: "true"}
      }
      else{
        return { message: "Error creating new user", ok: "false"}
      }

  }catch(err){
    if(err.errno == 1062){
      return { message: "The username is already in use.", ok: "false"}
    }
    console.error("Error creatin new user", err)
    return { message: "Error creating new user", ok: "false"}
  }

 }
} 