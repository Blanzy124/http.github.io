import { emailModel } from "../models/mysql/emailsModel.mjs";
import { newEmailSchema } from "../schemas/emailSchema.mjs";
import express from 'express';

export class emailController {
 static codeVerification = class {
  static async setCodeVerification( req, res ){ //This is a post method
  const result =  newEmailSchema( req.body );
  if(!result.success){
   res.json({ error: JSON.parse(result.error.issues[0].message)})
   return 
  }
  else{
   const response = await emailModel.codeVerification.setCodeVerification( {result: result.data} );
   res.json(response);
  }
  }
 }
 static async setEmailVerification( req, res ){// This is a post method
  const { userEmail, emailStatus, userVerifyCode } = req.body;
  const result = newEmailSchema({userEmail});
  console.log(`from CONTROLLER user email: ${userEmail}, emailStatus: ${emailStatus}, userVerifuCode: ${userVerifyCode}`)
  if (!result.success) {
   return res.status(400).json({ message: result.error.issues[0].message, ok: "false" });
 }
  const response = await emailModel.setEmailVerification({ userEmail: result.data.userEmail, emailStatus, userVerifyCode})
  res.json(response);
 }
}


