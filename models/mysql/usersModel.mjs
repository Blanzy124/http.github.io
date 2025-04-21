import mysql from 'mysql2/promise'; 
import bcrypt from "bcrypt";
import dotenv from 'dotenv';
import sgMail from "@sendgrid/mail";

import { emailModel } from './emailsModel.mjs';

import { pool } from '../../configConecctionDB.mjs';
dotenv.config();

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
    `select userPassword from comentsDB.users where name = '${name}';`
   )
   if(user.length === 0){
    return { "message": "User do not exit, wrong user name or password" }
   }
   
  const match = await bcrypt.compare(userPassword, user[0].userPassword);
  if(match){
    console.log('match')
    var [user] = await conection.query(
      `select name, userStatus from comentsDB.users where name = '${name}';`
     )

    return user;
  }
  else{
    return { message: "User do not exit, wrong user name or password" };
  }
  }
 }

 static async createNewUser ( { result }){
  await verifyConection();
  if (!conection) {
    throw new Error('No se pudo establecer la conexión con la base de datos');
  }


  try{
  const saltRounds = 10;
  const hash = await bcrypt.hash(result.userPassword, saltRounds);
        const [createUser] = await conection.query(`
          insert into comentsDB.users (name, userPassword, userStatus, userEmail)
          values ('${result.name}','${hash}', 'user', '${result.userEmail}');
          `)
          if(createUser.affectedRows > 0){
            const setEmail = await emailModel.setUserEmail( {userEmail: result.userEmail} );
            if(setEmail.ok != "true"){
              return setEmail //{ message: `${setEmail.message}`, errorCode: `${setEmail.errorCode}`, ok: `${setEmail.ok}`}
            }
            else{
              const setCodeV = await emailModel.codeVerification.setCodeVerification( {userEmail: result.userEmail} );
  
              if(setCodeV.ok != "true"){ 
                return setCodeV //{ message: `${setCodeV.message}`, errorCode: `${setCodeV.errorCode}`, ok: `${setCodeV.ok}`};
              }
              else{
                return { message: "User has been created and verification code has been sent", ok: "true"}
              }
           }
          }
          else{
            return { message: "Error creating new user", ok: "false"}
          }
      }catch(err){
        if(err.errno == 1062){
          return { message: "The username is already in use.", ok: "false"}
        }
        else{
          console.error("Error creatin new user", err)
          return { message: "Error creating new user", ok: "false"}
        }
    } 
 }
} 
