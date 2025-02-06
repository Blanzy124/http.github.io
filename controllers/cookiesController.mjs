import express from 'express';
import { cookiesModel } from '../models/mysql/cookiesModel.mjs';

export class cookiesController{
 static async setCookie (req, res) {
  console.log('prueba controler')
  const userNameCookie = req.body;
  const setCookie = await cookiesModel.setCookie({ userNameCookie })
  console.log(setCookie, 'testset')
  if(setCookie.message){
   res.json(setCookie)
   return
  }
  if(setCookie[0]["bin_to_uuid(cookieId)"]){
   const cookieId = setCookie[0]["bin_to_uuid(cookieId)"];
   console.log(cookieId, 'ifModel')
   res.cookie('cookieId', cookieId, { httpOnly: false, path: '/' , sameSite: 'strict', secure: false, maxAge: 1000 * 60 * 60 * 24 * 7});
   res.json(setCookie)
   return
  }
 }
}
