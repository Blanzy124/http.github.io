import express from 'express';
import { cookiesModel } from '../models/mysql/cookiesModel.mjs';

export class cookiesController{
 static async setCookie (req, res) {
  const { userNameCookie } = req.body;
  const setCookie = await cookiesModel.setCookie({ userNameCookie })
   res.json(setCookie)
   return
 }

 static async cookieVerification(req, res) {
  const { cookieId } = req.params;
  const cookieV = await cookiesModel.cookieVerification({ cookieId })
  res.json(cookieV)
 }

 static async cookieDelete (req, res){
  const {cookieId} = req.params;
  const cookieDelete = await cookiesModel.cookieDelete({ cookieId })
  res.json(cookieDelete)
 }
}