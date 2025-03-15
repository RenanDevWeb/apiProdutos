import mysql2 from 'mysql2'
import dotenv from 'dotenv'
dotenv.config()



// cria conexao com o banco de dados 
export const connection = mysql2.createConnection({
    host: process.env.LOCALHOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
})
