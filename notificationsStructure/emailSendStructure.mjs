import bcrypt from "bcrypt";
import dotenv from 'dotenv';
import sgMail from "@sendgrid/mail";

dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const privateEmail = process.env.PERSONAL_EMAIL;





export class emailsSender { 
 static async notifyVCodeWasSent ({ userEmail, verificationCode }){ //Send an email with the verification code
  const msg = {
   to: `${userEmail}`,
   from: 'blanzy@blanzynetwork.com',
   subject: 'Your verification code.',
   text: `Your verification code is: ${verificationCode}`,
   html: `<h1 style="color:blue;">Your verification code is: </h1><p style="font-size: 20px;"><strong>${verificationCode}</strong></p>`,
 }
 try{
  const [response] = await sgMail.send(msg);
  if(response.statusCode === 202){
   return { message: "Email has been sent", ok: true}
  }
  else{
   return { message: "Error sending email", errorCode: 600, ok: false}
  }
  //console.log("Email has been send: ", response)
 }catch(err){
  console.error("Error sendinn email: ", err)
  return { message: "Error sending email", errorCode: 601, ok: false}
 }
 }

 
 static async notifyEmailWasActivated ({userEmail}){
  const msg = {
   to: `${userEmail}`,
   from: 'blanzy@blanzynetwork.com',
   subject: 'Your email address is now verified.',
   text: `Your email address is now verified.`,
   html: `<h1 style="color:blue;">Your email address was verified.</h1>`,
 }
 try{
  const [response] = await sgMail.send(msg);
  if(response.statusCode === 202){
   return { message: "Email has been sent", ok: true}
  }
  else{
   return { message: "Error sending email", errorCode: 600, ok: false}
  }
  //console.log("Email has been send: ", response)
 }catch(err){
  
  console.error("Error sendinn email: ", err)
  return { message: "Error sending email", errorCode: 601, ok: false} 
 }
 }

};

export class emailManagerNotification{
  static async ipBlockNotification({ip}){
  const msg = {
   to: privateEmail,
   from: 'blanzy@blanzynetwork.com',
   subject: 'New ip address blocked',
   text: `The ip address ${ip} was block`,
   html: `<h1 style="color:blue;">The ip address ${ip} was block.</h1>`,
 }
 try{
  const [response] = await sgMail.send(msg);
  if(response.statusCode === 202){
   return { message: "Email has been sent", ok: true}
  }
  else{
   return { message: "Error sending email", errorCode: 600, ok: false}
  }
 }catch(err){
  
  console.error("Error sendinn email: ", err)
  return { message: "Error sending email", errorCode: 601, ok: false} 
 }
  }
}



