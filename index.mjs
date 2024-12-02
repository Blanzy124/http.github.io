import fs from 'node:fs'
import path from 'node:path'
import { create } from './create.mjs'
import inquirer from 'inquirer'

export const folder = path.join('.', '/users')

function comentCreat(){
  inquirer.prompt([{
    type: 'input',
    name: 'userName',
    message: 'Your name'
  }]).then(( {userName} ) => {

  })
}