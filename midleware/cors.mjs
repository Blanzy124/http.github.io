import cors from 'cors'

const ACEPTED_WEBS = [
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