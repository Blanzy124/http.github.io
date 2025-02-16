import express from 'express';
import crypto from 'node:crypto';
import mysql from 'mysql2/promise'; 
import { pool } from '../../configConecctionDB.mjs';

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

export class blangymModel{
 static async gymPost({ result, userName }){
  await verifyConection();
  if (!conection) {
    throw new Error('No se pudo establecer la conexión con la base de datos');
  }

  try{
    if(result.userName && result.date && result.muscleGroup && result.weight && result.reps && result.rest && result.notes){
     let [gymPost] = await conection.query(`
      insert into comentsDB.exercises (userName, date, muscleGroup, weight, reps, rest, notes)
      values ('${result.userName}', '${result.date}', '${result.muscleGroup}', '${result.weight}', '${result.reps}', '${result.rest}', '${result.notes}');
    
      `)
      return gymPost = { message: `blanGym Post Success`}
    }

    if(result.userName && result.date && result.muscleGroup && result.weight && result.reps && result.rest){
      let [gymPost] = await conection.query(`
       insert into comentsDB.exercises (userName, date, muscleGroup, weight, reps, rest)
       values ('${result.userName}', '${result.date}', '${result.muscleGroup}', '${result.weight}', '${result.reps}', '${result.rest}');
      
       `)
       return gymPost = { message: `blanGym Post Success`}
     }
  }catch(err){
    console.log(err)
    const gymPost = { message: `Post exercise error`, err: `${err}`}
    return gymPost
  }

 }
 static async gymGet({ userName }){
  await verifyConection();
  if (!conection) {
    throw new Error('No se pudo establecer la conexión con la base de datos');
  }
  try{
    let [gymGet] = await conection.query(`
      select bin_to_uuid(exerciseId), userName, date, muscleGroup, weight, reps, rest, notes from comentsDB.exercises where userName = "${userName}" ORDER BY STR_TO_DATE(date, '%a, %b %d, %Y') DESC;
      `)
      return gymGet
  }catch(err){
    console.log(err)
    const gymGet = { message: `Get exercise error`, err: `${err}`}
    return gymGet
  }
 }

 static async gymDelete({ exerciseId }){
  await verifyConection();
  if (!conection) {
    throw new Error('No se pudo establecer la conexión con la base de datos');
  }
  try{
    const [gymDelete] = await conection.query(`
      delete from comentsDB.exercises where exerciseId = uuid_to_bin('${exerciseId}');
      `)
      if(gymDelete.affectedRows >= 1){
        return { message: "Exercise Has Been Deleted"}
      }
      else{
        return { message: "Exercises Do Not Exist"}
      }
  }catch(err){
    console.log("Error Deleting an exercise: ", err)
    return { message: "Error Deleting The Exrcise"}
  }
 }
}


