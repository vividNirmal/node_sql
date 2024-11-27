import express from "express";
import connectToDatabase from "../database/config.js";
import { comparePassword } from "../constant/encrypt.js";

const router = express.Router();

router.get("/", async (req, res) => {
  res.send("Login page");
});

router.post("/", async (req, res) => {
  const { email, password } = req.body;
  // Database connection
  const database = await connectToDatabase();
  if (!database) {
    return res.status(500).send("Database connection failed");
  }

  // Validate input
  if (!email || !password) {
    return res
      .status(400)
      .send({ message: "Email and password are required", status: 400, success: false });
  }

  try {
    const query = `SELECT * FROM AuthTable WHERE email = @Email`;
    const result = await database.request().input("Email", email).query(query);

    if (result.recordset.length === 0) {
      return res.status(401).send({ message: "Invalid credentials", status: 401, success: false });
    }

    const user = result.recordset[0];
    const passwordMatch = await comparePassword(password, user.password); // Compare hashed passwords
    
    if (!passwordMatch) {
      return res.status(401).send({ message: "Invalid credentials", status: 401, success: false });
    }
    res.status(200).send({ message: "Login successful", status: 200, success: true });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).send({ message: "Internal server error", status: 500, success: false });
  }
});

export default router;