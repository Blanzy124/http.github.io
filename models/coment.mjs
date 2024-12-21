import express from 'express';
import path from 'node:path';
import crypto from 'node:crypto';
import fs from 'node:fs';
//import coments from '../users/coments.json'  assert { type: 'json' };

const coments = [
  {
    "id": "5d07d6d0-9079-473b-ae52-11dca3135921",
    "coment": "Samuel es el mejor hijo del mundo",
    "name": "Samuel",
    "age": 20
  },
  {
    "id": "dec5d259-89a8-4bb7-8e3e-6accef1ae9fc",
    "coment": "Samuel es el mejor hijo del mundo",
    "name": "Samuel",
    "age": 48
  },
  {
    "id": "eae7a2f8-d4d4-4e3f-b97e-29d9c23bfffd",
    "coment": "Samuel es el mejor hijo del mundo",
    "name": "Samuel",
    "age": 50
  },
  {
    "id": "b72318e6-9c2b-4da0-bd0d-3d3ee49f4498",
    "coment": "Samuel es el mejor hijo del mundo",
    "name": "Samuel",
    "age": 50
  },
  {
    "id": "5ce6185d-5838-4cc3-be39-caeabda99983",
    "coment": "Samuel es el mejor hijo del mundo",
    "name": "Daniela",
    "age": 50
  },
  {
    "id": "f7dc79bc-805e-4545-b5e1-3900b13f97b8",
    "coment": "Samuel es el mejor hijo del mundo",
    "name": "Daniela",
    "age": 61
  },
  {
    "id": "d3153dbc-5d2d-4675-b0c9-6f3f0b1f7985",
    "coment": "Samuel es el mejor hijo del mundo",
    "name": "Daniela",
    "age": 61
  },
  {
    "id": "b1d4cf7e-55ab-40f9-b558-48bc9e6a2754",
    "coment": "Samuel es el mejor hijo del mundo",
    "name": "Daniela",
    "age": 61
  },
  {
    "id": "e143409f-ca66-4ac0-9696-c5eb7ef98d6a",
    "coment": "Samuel es el mejor hijo del mundo",
    "name": "Daniela",
    "age": 61
  },
  {
    "id": "68e71b38-8c5a-4a6c-b71f-de31e9726efb",
    "coment": "Samuel es el mejor hijo del mundo",
    "name": "Daniela",
    "age": 61
  },
  {
    "id": "ca941dc5-c957-44fb-954e-79ab17d6d7ab",
    "coment": "Samuel es el mejor hijo del mundo",
    "name": "Daniela",
    "age": 61
  },
  {
    "id": "c33f2bc0-94fb-4ed3-8f63-ec31c1ad3ffb",
    "coment": "Samuel es el mejor hijo del mundo",
    "name": "Daniela",
    "age": 61
  },
  {
    "id": "f83050e3-4fd1-4036-8bbf-72239fc008f7",
    "coment": "Samuel es el mejor hijo del mundo",
    "name": "",
    "age": 50
  },
  {
    "id": "a124d5c2-5395-445b-9902-c40d20e1b964",
    "coment": "Samuel es el mejor novio del mundo",
    "name": "Vilma",
    "age": 50
  },
  {
    "id": "1ef03e5d-e6d1-4ef4-9dcc-cb5792f61676",
    "coment": "Samuel es el mejor novio del mundo",
    "name": "Vilma",
    "age": 50
  },
  {
    "id": "9c4f4c88-8e0c-4722-ae59-740465cddb0e",
    "coment": "Samuel es el mejor novio del mundo y el manda",
    "name": "Vilma",
    "age": 50
  },
  {
    "id": "9070ac02-2689-468e-bf9d-0e1f426f1477",
    "coment": "Samuel es el mejor novio del mundo y el manda",
    "name": "Vilma",
    "age": 50
  },
  {
    "id": "27d8da18-3727-4408-8abd-0c4c9bc5baa0",
    "coment": "Samuel es el mejor novio del mundo y el manda des siempre",
    "name": "Vilma",
    "age": 20
  },
  {
    "id": "f0146ab8-7c5e-4816-9544-fdb612e617ca",
    "coment": "Samuel es el mejor novio del mundo y el manda des siempre",
    "name": "Vilma",
    "age": 20
  },
  {
    "id": "680aa884-d150-4fc2-83d9-ee820af89adb",
    "coment": "Samuel es el mejor novio del mundo y el manda des siempre",
    "name": "Vilma",
    "age": 20
  },
  {
    "id": "32932b80-68f4-4a51-abc6-956003738636",
    "coment": "Samuel es el mejor novio del mundo y el manda des siempre",
    "name": "Vilma",
    "age": 20
  },
  {
    "id": "0d3a63d4-48b3-44ba-8dd5-540bdc7571ce",
    "coment": "Samuel es el mejor novio del mundo y el manda des siempre",
    "name": "Vilma",
    "age": 20
  },
  {
    "id": "459d1660-d2b0-4eb1-9ae2-ebdddf99c023",
    "coment": "te amo mi amor",
    "name": "Vilma",
    "age": 19
  },
  {
    "id": "1dad2e0e-37ff-4d87-8a2a-f201b24906a0",
    "coment": "te amo mi amor Vilma",
    "name": "Samuel",
    "age": 19
  }
]
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