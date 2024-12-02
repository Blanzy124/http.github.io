import fs from 'node:fs';
import { folder } from './index.mjs';
import path from 'node:path';

export function createFolderUser(userName){


} 

export function createComent (coment) {
  const dateNameFile = path.join(folder, `${new Date().toLocaleString()}.txt`)
  fs.writeFile(dateNameFile, `C:${coment}`, 'utf8', (err) => {
    if (err) {
      console.error('No se pudo crear el comentario')
      return
    }
    console.log('Creacion del comentario exitosa')
  })
}




