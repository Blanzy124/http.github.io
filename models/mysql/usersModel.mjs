import mysql, { escape } from 'mysql2/promise'; 
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

export class userModel {
 static async getUser ({ userName, userPassword }) {
  await verifyConection();
  if (!conection) {
    throw new Error('No se pudo establecer la conexión con la base de datos');
  }
  if(userName && userPassword){
    const passMatch = await userModel.checkPassword({userName, userPassword});

    if(passMatch.ok === true){
      const userEmail = await emailModel.getUserEmail({ userName }) 
      if(userEmail.ok !== true){return userEmail;}
      else{
        const emailStatus = await emailModel.checkEmailStatus({ userEmail: userEmail.data.userEmail });
        if(emailStatus.ok !== true){return emailStatus} //This returns a MEO.
        else{
          //console.log('match')
          const [user] = await conection.query(
            `select name, userStatus from comentsDB.users where name = ?;`, [userName]) //XX
           if(user.length === 0 ){
            return { message: "User do not found", errorCode: 203, ok: false}; //XX
           }
           else{
             return { message: "Get user succes", ok: true, data: { name: user[0].name, userStatus: user[0].userStatus}}; //XX
           }
  
        }
      }
    }
  else{
    return passMatch;
  }
  
  }
  else{
    return { message: "Missing data", errorCode: 202, ok: false}; //XX
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
          values ( ?, ?, 'user', ?);`, [result.name, hash, result.userEmail] 
        )
          if(createUser.affectedRows > 0){
            const setEmail = await emailModel.setUserEmail( {userEmail: result.userEmail} );
            if(setEmail.ok !== true){
              return setEmail 
            }
            else{
              const setCodeV = await emailModel.codeVerification.setCodeVerification( {userEmail: result.userEmail} );
  
              if(setCodeV.ok !==  true){ 
                return setCodeV //This returns a MEO.
              }
              else{
                return { message: "User has been created and verification code has been sent", ok: true} //XX
              }
           }
          }
          else{
            return { message: "Error creating new user", errorCode: 207, ok: false} //XX
          }
      }catch(err){
        if(err.errno == 1062){
          return { message: "The username is already in use.", errorCode: 206, ok: false} //XX
        }
        else{
          console.error("Error code: 205", err)
          return { message: "Error creating new user", errorCode: 205, ok: false} //XX
        }
    } 
 }

 static async checkPassword( { userEmail, userName, userPassword }) { //This has 2 true
  await verifyConection();
  if (!conection) {
    throw new Error('No se pudo establecer la conexión con la base de datos');
  }
  try{
    if(userEmail && userPassword){
      var [user] = await conection.query(
        `select userPassword from comentsDB.users where userEmail = ?;`, [userEmail]) //XX
       if(user.length === 0){
        return { message: "User email do not found", errorCode: 204, ok: false} //XX
       }
       else{
         const match = await bcrypt.compare(userPassword, user[0].userPassword);
        if(match){
          return { message: "Password compared and verified", ok: true} //XX
        }
        else{ return { message: "Password do not match", errorCode: 201, ok: false}} //XX
       }
    }
    if(userName && userPassword){
      var [user] = await conection.query(
        `select userPassword from comentsDB.users where name = ?;`, [userName]) //XX 
       if(user.length === 0){
        return { message: "User name do not found", errorCode: 210, ok: false } //XX
       }
       else{
         const match = await bcrypt.compare(userPassword, user[0].userPassword);
        if(match){
          return { message: "Password compared and verified", ok: true} //XX
        }
        else{ return { message: "Password do not match", errorCode: 201, ok: false}} //XX
       }
    }
    else{ return { message: "Missing data", errorCode: 202, ok: false}} //XX
  }catch(err){
    console.error("Error code : 209", err)
    return { message: "Error checking password", errorCode: 209, ok: false}
  }
 }
} 
