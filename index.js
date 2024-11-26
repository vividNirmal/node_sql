import express from "express";
import register from "./src/auth/register.js"
import login from "./src/auth/lognin.js"

const port = 5090;
const app = express();
app.use(express.json());
app.use('/register',register)
app.use('/login',login)
app.listen(port, () => {
  console.clear();
  
  console.log(`server is running Link : http://localhost:${port}`);
});
