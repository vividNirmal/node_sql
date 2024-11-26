import sql from "mssql";
import dotenv from 'dotenv';

dotenv.config();

const config ={
  user :  process.env.AZURE_SQL_USER,
  password :process.env.AZURE_SQL_PASSWORD,
  server :process.env.AZURE_SQL_SERVER ,
  database : process.env.AZURE_SQL_DATABASE ,
  port : Number(process.env.AZURE_SQL_PORT),
  options : {
    trustedConnection : true,
    trustServerCertificate : true
  }
}

let pool 

const connectToDatabase = async () => {
  try {
    pool = await sql.connect(config);   
    return pool
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
};

export default connectToDatabase;