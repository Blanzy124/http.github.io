import express from 'express';
//import { corsMiddleware } from './midleware/cors.mjs';
import { comentsRouter } from './routers/comentsRouter.mjs';
import { raizRouter } from './routers/raizRauter.mjs';

const app = express()

app.use(express.json());
//corsMiddleware();
app.use((req, res, next) => {
 res.header('Access-Control-Allow-Origin', '*');
 res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
 next();
});
app.use('/', raizRouter);
app.use('/coments', comentsRouter);


const PORT = 1235

app.listen(PORT, '0.0.0.0', () => {
 console.log(`escuchando a http://localhost:${PORT}`)
})