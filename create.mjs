import fs from 'node:fs';
import { folder } from './index.mjs';
import path from 'node:path';
import { comentCreationStart } from './index.mjs';
import { report } from 'node:process';






export function createComent(userComment, userFolder) {
  const dateNameFileComent = path.join(userFolder, `${new Date().toLocaleString().replace(/[/:,]/g, '-')}.txt`)
  fs.writeFile(dateNameFileComent, `${userComment}`, 'utf8', (err) => {
   if (err) {
     console.error('No se pudo crear el comentario')
     console.log(`pleace try again`)
     comentCreationStart()
     return
   }
    console.log('Creacion del comentario exitosa')
  })
}




