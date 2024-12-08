import fs from 'node:fs';
import path from 'node:path';









export function createComentHttp(userComment) {
  const userFolder = path.join('.', 'users', 'Samuel')
  const dateNameFileComent = path.join(userFolder, `${new Date().toLocaleString().replace(/[/:,]/g, '-')}.txt`)
  fs.writeFile(dateNameFileComent, `${userComment}`, 'utf8', (err) => {
   if (err) {
     console.error('No se pudo crear el comentario')
     return
   }
    console.log('Creacion del comentario exitosa')
  })
}



