import express from 'express';
import path from 'node:path';
import crypto from 'node:crypto';
import fs from 'node:fs';
import coments from '../../users/coments.json'  assert { type: 'json' };

//const comentsPath = path.join('..', 'users', 'coments.json') 

export class comentModel {
 static async getALL ({ name, age }) {
  if (name && age) { 
   const filterNameAndAgeComents = coments.filter(
    coment => coment.name.toLowerCase().includes(name.toLowerCase()) && 
    coment.age == age 
   )
   return filterNameAndAgeComents
  }
 if (name) {
  const filterUserComents = coments.filter(
   coment => coment.name.toLowerCase().includes(name.toLowerCase())
  )  
  return filterUserComents
 }
 if (age){
  const filterAgeComents = coments.filter(
   coment => coment.age == age
  )  
  return filterAgeComents
 }
 else{
  console.log('peticion de todos los comentarios')
   return coments
 } 
 }

 static async getByID ({ id }) {
  var coment = coments.find(coment => coment.id === id)
  if (coment === undefined){
   return [{ "message": "Not Found"}]
  }
  else {
   return coment
  }

 }
 static async postComent ({ result }) {
  const newComent = {
     id: crypto.randomUUID(),
     ...result
    }
  coments.push(newComent)
  return newComent
 }
 static async comentPatch ({ id, restultP }) {
  const comentP = coments.findIndex(coment => coment.id === id)
  if(comentP === -1) {
    return [{ message: "Coment not found"}]

    }
  
  const patchcoment = {...coments[comentP], ...restultP.data}
  coments.push(patchcoment)
  return patchcoment
 }
 static async comentDelete ({ id }) {
  var coment = coments.findIndex(coment => coment.id === id)

  if(coment === -1){
    return coment = [{ message: "Coment Not Found"}]
  } 
  coments.splice(coment, 1)
  return coment = [{ message: "coment has been deleted"}]
 }
}
