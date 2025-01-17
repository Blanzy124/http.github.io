import express from 'express';
import { wellcomeModel } from '../models/local_files/raizModel.mjs';


export class raizController {
 static async wellcome (req, res) {
  const wellcome = await wellcomeModel.wellcome()
  res.json(wellcome)
 }
}