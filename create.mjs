import fs from 'node:fs';
import { folder } from './index.mjs';
import path from 'node:path';

export function create (userName, coment, date) {
  const fileUserPath = path.join(folder, `${userName}.txt`)
  fs.writeFile(fileUserPath, `C:${coment}       D:${date}`, 'utf8', (err) => {
    if (err) {
      console.error('algo salio mal en la escritura del archivo')
      return
    }
    console.log('Creacion del usuario exitosa')
  })
}




