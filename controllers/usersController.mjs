import express from 'express';
import { userModel } from '../models/mysql/usersModel.mjs';
import { newUserSchema } from '../schemas/usersSchema.mjs';

export class usersController {
 static async getUser (req, res ) {
  const { userName } = req.query;
  const { userPassword } = req.query;
  //console.log(userPassword)
  const user = await userModel.getUser({ userName,  userPassword })
  res.json(user)
  }

  static async createNewUser(req, res){
    const result = newUserSchema(req.body)
    //console.log(req.body, "controller body")
    if(!result.success){
      //console.log(result.error.issues[0].message, 'user controller')
      res.status(400).json({ message: result.error.issues[0].message, errorCode: 208 , ok: false})
      return
    }
    else{ 
      const createNewUser = await userModel.createNewUser({ result: result.data })
      if(createNewUser.ok  !== true){
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