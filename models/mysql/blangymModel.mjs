import express from 'express';
import crypto from 'node:crypto';
import mysql from 'mysql2/promise'; 
import { pool } from '../../configConecctionDB.mjs';

let conection;
async function verifyConection(retryCount = 3) {
   try {
     if (!conection || conection.connection._closing) {
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
         values (?, ?, ?, ?, ?, ?, ?);`, [result.userName, result.date, result.muscleGroup, result.weight, result.reps, result.rest, result.notes])
         if(gymPost.affectedRows > 0){
          return { message: "Exercise post succes", ok: true}
        }
        else{
         return { message: "Exercise post error", errorCode: 405, ok: false}
        }
    }
    if(result.userName && result.date && result.muscleGroup && result.weight && result.reps && result.rest){
        let [gymPost] = await conection.query(`
         insert into comentsDB.exercises (userName, date, muscleGroup, weight, reps, rest)
         values (?, ?, ?, ?, ?, ?);`, [result.userName, result.date, result.muscleGroup, result.weight, result.reps, result.rest])
         if(gymPost.affectedRows > 0){
           return { message: "Exercise post succes", ok: true}
         }
         else{
          return { message: "Exercise post error", errorCode: 405, ok: false}
         }
     }
  }catch(err){
    console.error("Error code: 403", err)
    return { message: "Post exercise error", errorCode: 403, ok: false}
  }

 }
 static async gymGet({ userName }){
  await verifyConection();
  if (!conection) {
    throw new Error('No se pudo establecer la conexión con la base de datos');
  }
  try{
    let [gymGet] = await conection.query(`
      select bin_to_uuid(exerciseId), userName, date, muscleGroup, weight, reps, rest, notes from comentsDB.exercises where userName = ? ORDER BY STR_TO_DATE(date, '%a, %b %d, %Y') DESC;`, [userName])
    if(gymGet.length > 0){
      return { message: "Get exercise succes", ok: true, data: { exercises: gymGet } }
    }
    else{
      return { message: "Exercises do not found", errorCode: 404, ok: false}
    }
  }catch(err){
    console.error("Error code: 402", err)
    return { message: "Get exercise error", errorCode: 402, ok: false}
  }
 }

 static async gymDelete({ exerciseId }){
  await verifyConection();
  if (!conection) {
    throw new Error('No se pudo establecer la conexión con la base de datos');
  }
  try{
    const [gymDelete] = await conection.query(`
      delete from comentsDB.exercises where exerciseId = uuid_to_bin(?);`, [exerciseId])
      if(gymDelete.affectedRows >= 1){
        return { message: "Exercise Has Been Deleted", ok: true}
      }
      else{
        return { message: "Exercise do not found", errorCode: 401, ok: false}
      }
  }catch(err){
    console.error("Error code: 400", err)
    return { message: "Error Deleting The exercise", errorCode: 400, ok: false} 
  }
 }
}


