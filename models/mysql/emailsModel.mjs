import mysql from 'mysql2/promise'; 
import dotenv from 'dotenv';
import sgMail from "@sendgrid/mail";

import { emailsSender } from '../../notificationsStructure/emailSendStructure.mjs';

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

 export class emailModel{
  static codeVerification = class {
    static async setCodeVerification({userEmail}){
      await verifyConection();
      if (!conection) {
        throw new Error('No se pudo establecer la conexión con la base de datos');
      }
      if(userEmail){
        const randomVerificationCode = Math.floor(100000 + Math.random() * 900000);
        try{
          const [setDBVerificationcode] = await conection.query(
            `update comentsDB.userEmails set verificationCode = ?, userEmailExpiration = DATE_ADD(NOW(), INTERVAL 10 MINUTE) where userEmail = ?`, [randomVerificationCode, userEmail]); //XX
          if(setDBVerificationcode.affectedRows === 0){
            return { message: "User email not found", errorCode: 504, ok: false} //XX
          }
          if(setDBVerificationcode.affectedRows > 0){
            const SEresponse = await emailsSender.notifyVCodeWasSent( {userEmail, verificationCode: randomVerificationCode});
            if(SEresponse.ok == true){
              return { message: "Verification code was saved and sent", ok: true} //XX
            }

            else{
              console.error("Error code: 508")
              return { message: "Verification code was saved but not sent", errorCode: 508, ok: false} //XX
            }
          }
          else{
            console.error("Error code: 505")
            return { message: "Error setting verification code", errorCode: 505, ok: false} //XX
          }
        }catch(err){
          console.error("Error code 506: ", err)
          return { message: "Error setting verification code", errorCode: 506, ok: false} //XX
        }
      }
      else{
        return { message: "There is not email", errorCode: 507,ok: false}; //XX
      }
    }

    static async checkCodeVerification({userVerifyCode, userEmail}) {
    await verifyConection();
    if (!conection) {
      throw new Error('No se pudo establecer la conexión con la base de datos');
    }

    if(userVerifyCode && userEmail){
     try{
      const [DBVerificationCode] = await conection.query(
       `SELECT verificationCode FROM comentsDB.userEmails where userEmail = ? and userEmailExpiration > NOW();`, [userEmail]); //XX
      
       if(DBVerificationCode.length === 0){
        return { message: "There is not a verification code active", errorCode: 500, ok: false} //XX
       }
       if(parseInt(userVerifyCode) === DBVerificationCode[0].verificationCode){
        return { message: "Code verified and match", ok: true} //XX
       }
       if(parseInt(userVerifyCode) !== DBVerificationCode[0].verificationCode){
         return { message: "Code do not match", errorCode: 501, ok: false} //XX

       }
       else{
        return { message: "Error code verification", errorCode: 512, ok: false} //XX
       }
      
     }catch(err){
      console.error("Error code 502: ",err);
      return { message: "Code verification fail", errorCode: 502,ok: false}; //XX
     }     
    }
    else{
      return { message: "There are not email or verification code", errorCode: 503,ok: false}; //XX
    }
    }
  }
  //////
  static async setUserEmail({ userEmail }){ //use this to set user email into userEmails table, is a forean key, must exist emails in users table.
    await verifyConection();
    if (!conection) {
      throw new Error('No se pudo establecer la conexión con la base de datos');
    }
    if(userEmail){
      try{
        const [setEmail] = await conection.query(
          `insert into comentsDB.userEmails (userEmail) values (?)`, [userEmail]);
          if(setEmail.affectedRows > 0){
            return { message: "Email has beet created at email table", ok: true} //XX
          }
          else{
            console.error("Error Code: 516")
            return { message: "Error setting email in emails table", errorCode: 516, ok: false} //XX
          }
      }catch(err){
        if(err.errno == 1062){
          return { message: "Email is already in use", errorCode: 517, ok: false} //XX
        }
        if(err.errno == 1452){
          return { message: "This email do not exist.", errorCode: 521, ok: true}; //XX
        }
        else{
          console.error("Error code : 518", err);
          return { message: "Seting email error", errorCode: 518, ok: false}; //XX
        }
      }
    }
  }
  ////////
  static async setEmailVerification({ userEmail, emailStatus, userVerifyCode}){
   await verifyConection();
   if (!conection) {
     throw new Error('No se pudo establecer la conexión con la base de datos');
   }
   if(emailStatus && userEmail && userVerifyCode){
    const codeStatus = await emailModel.codeVerification.checkCodeVerification( {userVerifyCode, userEmail} );

    if(codeStatus.ok === true){
      try{
       const [setEmailV] = await conection.query(
        `update comentsDB.userEmails set emailVerified = ? where userEmail = ?`, [parseInt(emailStatus), userEmail]); //XX
        if(setEmailV.affectedRows > 0){
          const SEresponse = await emailsSender.notifyEmailWasActivated({userEmail});

          if(SEresponse.ok === true){
            return { message: `Email is verified now`, ok: true}; //XX
          }
          if(SEresponse.errorCode === 501){
            return SEresponse;
          }
          else{
            return { message: "Email status was set but email confirmation was not send", errorCode: 511, ok: false} //XX
          }
        }
        else{
         return { message: "Error setting email status", errorCode: 509, ok: false} //XX
        }
       }catch(err){
        console.error("Error code: ", "510" ,err)
        return { message: "Error setting email status", errorCode: 510, ok: false} //XX
       }
    }
    else{
      return codeStatus;
    }
   }
   else{
    return { message: "Missing data", errorCode: 519, ok: false} //XX
   }

  }

  static async checkEmailStatus ({userEmail}){
    await verifyConection();
    if (!conection) {
      throw new Error('No se pudo establecer la conexión con la base de datos');
    }

    if(userEmail){
      try{
        const [emailStatus] =  await conection.query(
        `select emailVerified from comentsDB.userEmails where userEmail = ?`, [userEmail]) //XX
        if(emailStatus.length === 0){
          return { message: "User email not found", errorCode: 504, ok: false} //XX
        }
        if(emailStatus[0].emailVerified === 1){
          return { message: "Email is active", ok: true} //XX
        }
        else{
          return { message: "Email is not active", errorCode: 513, ok: false} //XX
        }
      }catch(err){
        console.error("Error code 515: ", err)
        return { message: "Error checkin email status", errorCode: 515, ok: false} //XX
      }
    }
  }
  static async getUserEmail({ userName }){
    await verifyConection();
    if (!conection) {
      throw new Error('No se pudo establecer la conexión con la base de datos');
    }

    if(userName){
      const [userEmail] = await conection.query(
        `select userEmail from comentsDB.users where name = ?`, [userName]) //XX

      if(userEmail.length === 0){
        return { message: "User email not found", errorCode: 504, ok: false } //XX
      }
      else{
        return { message: "Get user email succes", ok: true, data: {userEmail: userEmail[0].userEmail} } //XX
      }
    }
  }
}
 
 
 
 
 

 