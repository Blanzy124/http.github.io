import fs from 'node:fs'
import path from 'node:path'
import { create } from './create.mjs'
import inquirer from 'inquirer'

export const folder = path.join('.', '/users')

function verifyUserExist (userName, dataBase) {
  return dataBase.includes(`${userName}.txt`)
}

function nameQuestion () {
  inquirer.prompt([{
    type: 'input',
    name: 'userName',
    message: 'what Is Your Name?'
  }]).then(({ userName }) => {
    fs.readdir(folder, (err, dataBase) => {
      if (err) {
        console.error('Error')
      }

      if (verifyUserExist(userName, dataBase)) {
        console.error('el usuario ya existe, escribelo otro por favor')
        nameQuestion()
      } else {
        inquirer.prompt([{
          type: 'password',
          name: 'password',
          mask: '*',
          message: 'Escribe tu contrasena'
        }]).then(({ password }) => {
          create(userName, password, new Date().toLocaleString())
        })
      }
    })
  })
}
nameQuestion()