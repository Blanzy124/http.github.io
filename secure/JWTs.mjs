import dotenv from 'dotenv';
import jwtd from 'jsonwebtoken'
dotenv.config();
const jwtSecretKey = process.env.JWT_SECRET_KEY;
export class tokens {
 static JWTgeneration( { jti } ){
  if(!jti){ return { message: "No JTI in request", errorCode: 704, ok: false}}
  const payload = { jti: jti }
  const token = jwtd.sign(payload, jwtSecretKey, { expiresIn: "1h" })
  return token;
 } 

 static async JWTverify( req, res, next ){
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if(!token){
   res.json({ message: "No JWT", errorCode: 703, ok: false})
   return 
  }
  try{
   const jwtverification = jwtd.verify(token, jwtSecretKey)
   if(jwtverification){ next() }
   else { const errr = { message: "JWT verification fail", errorCode: 700, ok: false}; res.json(errr)}
  }catch(err){
   console.error("Error code: 701: ", err)
   { res.json({ message: "JWT verification error", errorCode: 701, ok: false})}
  }
 }
}


//TODAVIA ME QUEDA EL REFRESH DEL JWT, TENGO QUE LOGRAR QUE CADA 30 MINUTOS SE GENERE UN NUEVO JWT