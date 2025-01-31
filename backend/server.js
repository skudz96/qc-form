/* eslint-disable no-undef */
// loads environment variables. You need to create a .env file in the root of the project and provide details like so
import dotenv from "dotenv";

/* DB_USER=serge
DB_HOST=localhost
DB_NAME=your_db_name
DB_PASSWORD=your_db_password
DB_PORT=5432 */

import express from "express";
import cors from "cors";
import pkg from "pg";

const { Pool } = pkg;

dotenv.config();

const app = express();
const port = 5000;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

app.use(cors());
app.use(express.json());

// update request
app.put("/", async (req, res) => {
  const { id, var_mass, thing_1_has_happened, thing_2_has_happened, part_id } =
    req.body;

  // mandatory fields required
  if (!id || !var_mass || !part_id) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // tries to make request
  try {
    const result = await pool.query(
      `UPDATE stuff
      SET var_mass = $1, thing_1_has_happened = $2, thing_2_has_happened = $3, part_id = $4, datecreated=NOW()
      WHERE id = $5
      RETURNING *
      `,
      [var_mass, thing_1_has_happened, thing_2_has_happened, part_id, id]
    );

    // handles id not existing
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Row not found" });
    }
    res.json({ message: `Data inserted successfully`, data: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `An error occured` });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
