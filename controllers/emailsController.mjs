import { emailModel } from "../models/mysql/emailsModel.mjs";
import { userModel } from "../models/mysql/usersModel.mjs";
import { newEmailSchema } from "../schemas/emailSchema.mjs";
import express from 'express';

export class emailController {
 static codeVerification = class {
  static async setCodeVerification( req, res ){ //This is a post method
  const { userName, userEmail, userPassword } = req.body;
  const result =  newEmailSchema( {userEmail} );
  if(!result.success){
   res.json({ message: result.error.issues[0].message, errorCode: "520", ok: "false" })
   return 
  }
  else{
    const pass = await userModel.checkPassword({ userName, userPassword })
    if(pass.ok !== true){
      res.json(pass)
      return
    }
    else{
      const response = await emailModel.codeVerification.setCodeVerification( { userEmail: result.data.userEmail} );
      res.json(response);
    }
  }
  }
 }


 static async setEmailVerification( req, res ){// This is a post method
  const { userEmail, emailStatus, userVerifyCode } = req.body;
  const result = newEmailSchema({userEmail});
  if (!result.success) {
    res.status(400).json({ message: result.error.issues[0].message, errorCode: "520", ok: "false" });
   return 
 }
  const response = await emailModel.setEmailVerification({ userEmail: result.data.userEmail, emailStatus, userVerifyCode})
  res.json(response);
 }
}


