import express from 'express';
import { cookiesModel } from '../models/mysql/cookiesModel.mjs';

export class cookiesController{
 static async setCookie (req, res) {
  const { userNameCookie } = req.body;
  const setCookie = await cookiesModel.setCookie({ userNameCookie })
  console.log(setCookie, 'testset')
  if(setCookie.message){
   res.json(setCookie)
   return
  }
  if(setCookie[0]["bin_to_uuid(cookieId)"]){
   const cookieId = setCookie[0]["bin_to_uuid(cookieId)"];
   console.log(cookieId, 'ifModel')
   res.json(cookieId)
   return
  }
 }

 static async cookieVerification(req, res) {
  const { cookieId } = req.params;
  const cookieV = await cookiesModel.cookieVerification({ cookieId })
  console.log(cookieV, 'controller')
  res.json(cookieV)
 }

 static async cookieDelete (req, res){
  const {cookieId} = req.params;
  const cookieDelete = await cookiesModel.cookieDelete({ cookieId })
  res.json(cookieDelete)
 }
}