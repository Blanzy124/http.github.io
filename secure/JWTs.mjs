import dotenv from 'dotenv';
import jwtd from 'jsonwebtoken'
dotenv.config();
const jwtSecretKey = process.env.JWT_SECRET_KEY;
export class tokens {
 static JWTgeneration( { jti, userName, userStatus } ){
  if(!jti){ return { message: "No JTI in request", errorCode: 704, ok: false}}
  const payload = { "jti": jti, "userName": userName, "userStatus": userStatus }
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

 static async JWTverifyAdmin( req, res, next ){
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if(!token){
   res.json({ message: "No JWT", errorCode: 703, ok: false})
   return 
  }
  try{
   const jwtverification = jwtd.verify(token, jwtSecretKey)
   if(jwtverification){ 
    const payload = jwtd.decode(token)
    if(payload.userStatus === "admin"){ next() }
    else{ res.json({ message: "Access denied", errorCode: 706, ok: false}); return}
   }
   else { const errr = { message: "JWT verification fail", errorCode: 700, ok: false}; res.json(errr)}
  }catch(err){
   console.error("Error code: 701: ", err)
   { res.json({ message: "JWT verification error", errorCode: 701, ok: false})}
  }
 }

 static async JWTverifyWS(req){ // THIS IS LIKE A GET FUNTION, RETURN A DATA OBJECT
  const url = req.url;
  const queryString = url.replace(/^.*\?/, '');
  const params = new URLSearchParams(queryString);
  const token = params.get('token');
  if(!token){
   return { message: "No JWT in WS request", errorCode: 705, ok: false }
  }
  try{
   const jwtverification = jwtd.verify(token, jwtSecretKey)
   if(jwtverification){ return { message: "JWT verification succes", data: { userName: jwtverification.userName, userStatus: jwtverification.userStatus }, ok: true}}
   else { const err = { message: "JWT verification fail", errorCode: 700, ok: false}; return err}
  }catch(err){
   console.error("Error code: 701: ", err)
   { return { message: "JWT verification error", errorCode: 701, ok: false}}
  }
 }
}
