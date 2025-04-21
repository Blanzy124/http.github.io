import express from 'express';
import { wellcomeModel } from '../models/local_files/raizModel.mjs';


export class raizController {
 static async wellcome (req, res) {
  const ip = req.ip;
  const userAgent = req.get('User-Agent');
  console.log(`ip: ${ip}`);
  console.log(`userAgent: ${userAgent}`)
  const wellcome = await wellcomeModel.wellcome()
  res.json(wellcome)
 }
}