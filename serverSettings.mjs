import dotenv from 'dotenv';
dotenv.config();
const dbPassword = process.env.DB_PASSWORD;

import mysql from 'mysql2/promise'; 
export const PORT = 8443;
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

