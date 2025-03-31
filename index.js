const express = require("express");
const dotenv = require("dotenv");

const userRoutes = require("./Routes/userRoutes");
const connecttoDb = require("./config/database");
dotenv.config(); // dotenv.config(): Reads the .env file and loads variables into process.env.

const PORT = process.env.PORT || 3010;

const app = express();
connecttoDb();

app.use(express.json());
app.use("/api/users", userRoutes);

app.listen(PORT, () => {
  console.log(`Running on http://localhost:${PORT}`);
});
