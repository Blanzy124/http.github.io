import express from 'express';
import crypto from 'node:crypto';
import mysql from 'mysql2/promise'; 

let conection;
async function verifyConection(retryCount = 3) {
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
export class comentModel {
 static async getALL ({ name, age }) {
  await verifyConection();
  if (!conection) {
    throw new Error('No se pudo establecer la conexión con la base de datos');
  }
  if(name){
   const [coment] = await conection.query(
    `select coment, name, age from comentsDB.coments where name = '${name}';`
   )
   return coment
  }
  if(age){
   const [coment] = await conection.query(
    `select coment, name, age from comentsDB.coments where age = ${age};`
   )
   return coment
  }
  const [ coment ] = await conection.query(
    'select bin_to_uuid(id), coment, name, age from coments;'
  )
  console.log(conection, "conection log test")
  return coment
 }
 static async getByID ({ id }) {
  await verifyConection();
  if (!conection) {
    throw new Error('No se pudo establecer la conexión con la base de datos');
  }
 const [coment] = await conection.query(
  `select coment, name, age from comentsDB.coments where id = uuid_to_bin('${id}')`
 )
 return coment
 }
 static async postComent ({ result }) {
  await verifyConection();
  if (!conection) {
    throw new Error('No se pudo establecer la conexión con la base de datos');
  }
  
 const newComent = result;
  let [coment] = await conection.query(
   `insert into comentsDB.coments (name, coment, age) 
    values ('${newComent.name}', '${newComent.coment}', ${newComent.age});`
  )
  if (coment.affectedRows >= 1) {
    coment = { "message": "Coment has been create"}
    return coment
  }
  else{
    coment = { "message": "Coment creation error"}
    return coment
  }
 }
 
 static async comentPatch ({ id, restultP }) {
  await verifyConection();
  if (!conection) {
    throw new Error('No se pudo establecer la conexión con la base de datos');
  }
  if(restultP.data.name && restultP.data.coment && restultP.data.age){
    let [coment] = await conection.query(
      `update coments set name = '${restultP.data.name}', coment = '${restultP.data.coment}', age = '${restultP.data.age}' where id = uuid_to_bin('${id}');`
    )
    if (coment.affectedRows >= 1) {
      coment = { "message": "Coment, name and age has been update"}
      return coment
    }
    else{
      coment = { "message": "Coment, name or age updating error"}
      return coment
    }
  }
   ///////////////////
   if(restultP.data.name && restultP.data.coment){

     let [coment] = await conection.query(
       `update coments set name = '${restultP.data.name}', coment = '${restultP.data.coment}' where id = uuid_to_bin('${id}');`
     )
     if (coment.affectedRows >= 1) {
       coment = { "message": "Coment and name has been update"}
       return coment
     }
     else{
       coment = { "message": "Coment or name updating error"}
       return coment
     }
   }
    
   if(restultP.data.name && restultP.data.age){
    let [coment] = await conection.query(
      `update coments set name = '${restultP.data.name}', age = '${restultP.data.age}' where id = uuid_to_bin('${id}');`
    )
    if (coment.affectedRows >= 1) {
      coment = { "message": "Name andd age has been update"}
      return coment
    }
    else{
      coment = { "message": "Name or age updating error"}
      return coment
    }
  }

  if(restultP.data.age && restultP.data.coment){
    let [coment] = await conection.query(
      `update coments set age = '${restultP.data.age}', coment = '${restultP.data.coment}' where id = uuid_to_bin('${id}');`
    )
    if (coment.affectedRows >= 1) {
      coment = { "message": "Age and coment has been update"}
      return coment
    }
    else{
      coment = { "message": "Age or coment updating error"}
      return coment
    }
  }
  if(restultP.data.age && restultP.data.name){
    let [coment] = await conection.query(
      `update coments set age = '${restultP.data.age}', name = '${restultP.data.name}' where id = uuid_to_bin('${id}');`
    )
    if (coment.affectedRows >= 1) {
      coment = { "message": "Age and name has been update"}
      return coment
    }
    else{
      coment = { "message": "Age or name updating error"}
      return coment
    }
  }

   ///////////////////
  if(restultP.data.name){
    let [coment] = await conection.query(
      `update coments set name = '${restultP.data.name}' where id = uuid_to_bin('${id}');`
    )
    if (coment.affectedRows >= 1) {
      coment = { "message": "Name has been update"}
      return coment
    }
    else{
      coment = { "message": "Name updating error"}
      return coment
    }
  }
  if(restultP.data.coment){
    let [coment] = await conection.query(
      `update coments set coment = '${restultP.data.coment}' where id = uuid_to_bin('${id}');`
    )
    if (coment.affectedRows >= 1) {
      coment = { "message": "Coment has been update"}
      return coment
    }
    else{
      coment = { "message": "Coment updating error"}
      return coment
    }
  }

  if(restultP.data.age){
    let [coment] = await conection.query(
      `update coments set age = '${restultP.data.age}' where id = uuid_to_bin('${id}');`
    )
    if (coment.affectedRows >= 1) {
      coment = { "message": "Age has been update"}
      return coment
    }
    else{
      coment = { "message": "Age updating error"}
      return coment
    }
  }
  

 }
 static async comentDelete ({ id }) {
  await verifyConection();
  if (!conection) {
    throw new Error('No se pudo establecer la conexión con la base de datos');
  }
  let [coment] = await conection.query(
    `delete from coments where id = uuid_to_bin('${id}')`
  )
  if (coment.affectedRows >= 1) {
    coment = { "message": "Coment has been deleted"}
    return coment
  }
  else{
    coment = { "message": "Coment deleting error"}
    return coment
  }
 }
}


