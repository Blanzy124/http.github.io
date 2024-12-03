import fs from 'node:fs'
import path from 'node:path'
import { createComent } from './create.mjs'
import inquirer from 'inquirer'

export const folder = path.join('.', 'users')

function verifyUserExist (userName, dataBase) {
  return dataBase.includes(`${userName}`)
}

export function comentCreationStart(){
  inquirer.prompt([{
    type: 'input',
    name: 'userName',
    message: 'Your name'
  }]).then(( {userName} ) => {
    fs.readdir(folder, (err, dataBase) => {
      const userFolder = path.join(folder, userName)
      if (err) {
        console.error('Error, try again')
        comentCreationStart()
      }

      if (verifyUserExist(userName, dataBase)) {
        inquirer.prompt([{
          type: 'input',
          name: 'userComment',
          message: 'Write your comment'
        }]).then(( {userComment} ) => {
          createComent(userComment, userFolder)
        })
      } 
      else{
        fs.mkdir(`${userFolder}`, (err) => {
          if(err){
            console.error(`something is wrong with the user creation, make sure you spelled the name correctly, try again`)
            comentCreationStart()
          }
          else{
            console.log(`creating a new use name...`)
            console.log(`Make sure you spell your name correctly`)
            inquirer.prompt([{
              type: 'input',
              name: 'userComment',
              message: 'Write your comment'
            }]).then(( {userComment} ) => {
              createComent(userComment, userFolder)
            })
          }

        })
      }

    })
  })
}
comentCreationStart()
