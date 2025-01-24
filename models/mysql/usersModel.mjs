import mysql from 'mysql2/promise'; 

const config = {
  host: 'localhost',
  user: 'root',
  port: 3306,
  password: 'Mgee2005?',
  database: 'comentsDB',
}
//Mgee2005?
const conection = await mysql.createConnection(config)
export class userModel {
 static async getUser ({ name, userPassword }) {
  if(name && userPassword){
   var [user] = await conection.query(
    `select name, userStatus from comentsDB.users where name = '${name}' and userPassword = '${userPassword}';`
   )
   if(user.length === 0){
    user = { "message": "User do not exit, wrong user name or password"}
    return user
   }
   console.log(user)
   return user
  }
 }
} 