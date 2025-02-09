import mysql from 'mysql2/promise'; 
//Mgee2005?
let conection; //USE THIS VARIABLE ON EVERY MYSQL CONNECTION

export async function verifyConection(retryCount = 3) {
 //Mgee2005?
 const pool = mysql.createPool({
   host: "localhost",      
   user: "root",           
   password: "",  
   database: "comentsDB",  
   port: 3306,             
   waitForConnections: true,
   connectionLimit: 10,
   queueLimit: 0,
   enableKeepAlive: true, 
   keepAliveInitialDelay: 10000
 });
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