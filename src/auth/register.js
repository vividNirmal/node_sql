import express from "express";
import connectToDatabase from "../database/config.js";
import { encypteSalt, GenrateSalt } from "../constant/encrypt.js";

const router = express.Router();
// DATABASE_NAME
const Database = process.env.AZURE_SQL_DATABASE;
// get all user
router.get("/", async (req, res) => {
  try {
    const pool = await connectToDatabase();
    if (!pool) {
      return res.status(500).send("Database connection failed");
    }
    const query = `SELECT * FROM ${Database}.dbo.AuthTable`;
    const data = await pool.request().query(query);
    res.status(200).send({ massage: "get all user", status: 200, success: true, data: data });
  } catch (error) {
    console.log(error);
  }
});

// register user
router.post("/", async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    const database = await connectToDatabase();

    // Ensure the table exists if it doesn't already
    const createTableQuery = `
      IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'AuthTable')
      BEGIN
        CREATE TABLE ${Database}.dbo.AuthTable (
          id INT PRIMARY KEY IDENTITY(1,1),
          username VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          password VARCHAR(255) NOT NULL,
          salt VARCHAR(255) NOT NULL ,          
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      END
    `;
    await database.request().query(createTableQuery);

    // Check if the user already exists using parameterized query to prevent SQL injection
    const checkUserQuery = `
      SELECT 1 FROM ${Database}.dbo.AuthTable
      WHERE email = @email
    `;
    const request = database.request();
    request.input("email", email);

    const existingUserResult = await request.query(checkUserQuery);
    if (existingUserResult.recordset.length > 0) {
      return res.status(400).send({
        message: "User already exists",
        status: 400,
        success: false
      });
    }
    const newsalt = await GenrateSalt();  
    const hashedPassword = await encypteSalt(password, newsalt);  
        
    const insertUserQuery = `INSERT INTO ${Database}.dbo.AuthTable (username, email, password, salt) VALUES ('${username}', '${email}', '${hashedPassword}', '${newsalt}')`;

    const result = await request.query(insertUserQuery);

    if (!result) {
      return res.status(500).send({
        message: "Error inserting user into database",
        status: 500,
        success: false
      });
    }
    // Respond with success
    res.status(200).send({
      message: "User created successfully",
      status: 200,
      success: true
    });
  } catch (error) {
    // Handle any unexpected errors
    console.error("Database Error:", error);
    res.status(500).send({
      message: "Internal Server Error",
      status: 500,
      success: false
    });
  }
  next();
});

export default router;
