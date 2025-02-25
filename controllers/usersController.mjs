import express from 'express';
import { userModel } from '../models/mysql/usersModel.mjs';
import { newUserSchema } from '../schemas/usersSchema.mjs';

export class usersController {
 static async getUser (req, res ) {
  const { name } = req.query
  const { userPassword } = req.query
  console.log(userPassword)
  const user = await userModel.getUser({ name,  userPassword})
  res.json(user)
  }

  static async createNewUser(req, res){
    const result = newUserSchema(req.body)
    console.log(req.body, "controller body")
    if(result.error){
      console.log(result.error, 'user controller')
      res.status(400).json({ message: "Error creating new user", error: JSON.parse(result.error)})
      return
    }
    else{ 
      const createNewUser = await userModel.createNewUser({ result: result.data })
      if(createNewUser.ok !== "true"){
        res.status(400).json(createNewUser)
        return
      }
      else{
        res.status(201).json(createNewUser)
        return
      }
    }

  }

}  