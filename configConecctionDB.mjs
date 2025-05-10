import mysql from 'mysql2/promise'; 
//Mgee2005?
  export const pool = mysql.createPool({
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