import express from 'express';
import { userModel } from '../models/mysql/usersModel.mjs';
import { newUserSchema } from '../schemas/usersSchema.mjs';
import { cookiesModel } from '../models/mysql/cookiesModel.mjs';
import { tokens } from '../secure/JWTs.mjs';
export class usersController {
 static async getUser (req, res ) {
  const { userName } = req.body;
  const { userPassword } = req.body;
  //console.log(userPassword)
  const user = await userModel.getUser({ userName,  userPassword })
  res.json(user)
  }
  static async logIn (req, res ) {
    const { userName } = req.body;
    const { userPassword } = req.body;
    const user = await userModel.getUser( { userName,  userPassword } )
    if(user.ok !==true){ return user }
    const cookie = await cookiesModel.setCookie( { userNameCookie: userName } )
    if(cookie.ok !== true){ return cookie }
    res.json(cookie)
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
      res.json(createNewUser)
        
      
    }

  }

}  