import 'dotenv/config'
import app from "./src/app";
import pg from 'pg'

const PORT = 8080

const pool = new pg.Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  max: 20,
  connectionTimeoutMillis: 0,
  idleTimeoutMillis: 0,
});

const start = async() => {
    await pg.connect()
    app.listen(PORT,()=>{
    console.log(`Server is listening on ${port}`)
})
}

start().catch((error)=>{
    console.error('Failed to connect to server', error)
    process.exit(1)
})

