import mysql from 'mysql2/promise'; 

//const config = {
//  host: 'localhost',
//  user: 'root',
//  port: 3306,
//  password: '',
//  database: 'comentsDB',
//}
//Mgee2005?

const pool = mysql.createPool({
  host: "localhost",      
  user: "root",           
  password: "Mgee2005?",  
  database: "comentsDB",  
  port: 3306,             
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true, 
  keepAliveInitialDelay: 10000
});
//Mgee2005?
let conection;

async function verifyConection(retryCount = 3) {
  try {
    if (!conection || conection.connection._closing) {
      console.log(conection, 'if 1');
      conection = await pool.getConnection();
      console.log('Connection established');
    }
  } catch (err) {
    console.error('Connection error', err);
    if (retryCount > 0) {
      console.log('Retrying connection...');
      await new Promise(res => setTimeout(res, 1000)); // Espera 1 segundo antes de reintentar
      return await verifyConection(retryCount - 1);
    } else {
      console.error('Failed to establish connection after retries');
      conection = null;
    }
  }
  return conection;
}
export class userModel {
 static async getUser ({ name, userPassword }) {
  await verifyConection();
  if (!conection) {
    throw new Error('No se pudo establecer la conexión con la base de datos');
  }
  if(name && userPassword){
   var [user] = await conection.query(
    `select name, userStatus from comentsDB.users where name = '${name}' and userPassword = '${userPassword}';`
   )
   if(user.length === 0){
    [user] = { "message": "User do not exit, wrong user name or password"}
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