import mysql from 'mysql2/promise'; 

const config = {
  host: 'localhost',
  user: 'root',
  port: 3306,
  password: ' Mgee2005?',
  database: 'comentsDB',
}
//Mgee2005?
let conection;

async function verifyConection(){
  try{
  if(!conection){
    conection = await mysql.createConnection(config)
    return 
  }
}catch(err){
  conection = null;
  console.error('error en la coneccion', err)
}
return conection
}
verifyConection()
export class userModel {
 static async getUser ({ name, userPassword }) {
  await verifyConection();
  if(name && userPassword){
   var [user] = await conection.query(
    `select name, userStatus from comentsDB.users where name = '${name}' and userPassword = '${userPassword}';`
   )
   if(user.length === 0){
    user = { "message": "User do not exit, wrong user name or password"}
    return user
   }
   console.log(user)
   return user
  }
 }
} 

//
//async function config () {
//  if (!connection || connection.connection.state === 'disconnected') {
//    connection = await mysql.createConnection({
//      host: 'localhost',
//      user: 'root',
//      port: 3306,
//      password: '',
//      database: 'comentsDB',
//    });
//  }
//  return connection;
//}