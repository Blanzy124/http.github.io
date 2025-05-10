import { tokens } from "../secure/JWTs.mjs";

export class tokensController{
 static async JWTrefresh(req, res){
  console.log("estamos en el refresh", req.body)
  const { cookieId } = req.body;
  const JWTr = tokens.JWTgeneration({ jti: cookieId })
  res.json(JWTr)
 } 
}







