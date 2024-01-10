const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

const pool = new Pool({
  user: "postgres",
  host: "143.198.184.62",
  database: "pomermdev",
  password: "Ssh6655ip",
  port: 5432,
});

// Import routes
const applicationRoutes = require("./routes/abac");

// Use routes
app.use(cors());
app.use(express.json());
app.use("/api/abac", applicationRoutes);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
