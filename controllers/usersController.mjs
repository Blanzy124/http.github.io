import express from 'express';
import { userModel } from '../models/mysql/usersModel.mjs';
export class usersController {
 static async getUser (req, res ) {
  const { name } = req.query
  const { userPassword } = req.query
  console.log(userPassword)
  const user = await userModel.getUser({ name,  userPassword})
  res.json(user)
  }
}  