import cors from 'cors'

const ACEPTED_WEBS = [
 "http://localhost:1235/coments",
 "https://blanzy124.github.io",
 '*'
]



export const corsMiddleware = ({ acceptedOrigins = ACEPTED_WEBS } = {}) => cors({
 origin: (origin, callback) => {
  if(acceptedOrigins.includes(origin)){
   return callback(null, true)
  }
  if(!origin){
   return callback(null, true)
  }
  else {
   return callback(new Error('Not allowed by Cors'))
  }
 }
})