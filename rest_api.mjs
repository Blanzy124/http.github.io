import express from 'express';
import { corsMiddleware } from './midleware/cors.mjs';
import { comentsRouter } from './routers/comentsRouter.mjs';

const app = express()

app.use(express.json());
app.use(corsMiddleware())
app.use('/coments', comentsRouter)




const PORT = process.env.PORT ?? 1235

app.listen(PORT, '0.0.0.0', () => {
 console.log(`escuchando a http://localhost:${PORT}`)
})