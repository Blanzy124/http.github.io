import { tokens } from "../secure/JWTs.mjs";
import { cookiesModel } from "../models/mysql/cookiesModel.mjs";
import { userModel } from "../models/mysql/usersModel.mjs";


export class tokensController{
 static async JWTrefresh(req, res){
  const { cookieId } = req.body;
  
  
  const userName = await cookiesModel.getNameBacedOnCookieId({ cookieId })
  if(userName.ok !== true){ res.json(userName); return}
  
  const userStatus =  await userModel.getUserStatus({ userName: userName.data.userName })
  if(userStatus.ok !== true){ res.json(userStatus); return; }

  const JWTr = tokens.JWTgeneration({ jti: cookieId, userName: userName.data.userName, userStatus: userStatus.data.userStatus })
  if(JWTr.ok ==+ false){ res.json(JWTr); return;}

  res.json(JWTr)
 } 
}







