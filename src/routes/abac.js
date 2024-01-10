const express = require("express");
const router = express.Router();
const { Pool } = require("pg");

const pool = new Pool({
  user: "entossdev",
  host: "143.198.184.62",
  database: "pomermdev",
  password: "Ssh6655ip",
  port: 5432,
});
const clientId = "08C7EAA8543D4577B5EAA9BD7A86EDAF";

router.get("/", async (req, res) => {
  try {
    const { applicationName } = req.query; // Assuming the query parameter is named 'applicationName'

    if (!applicationName) {
      // Handle the case where the required parameter is missing
      return res
        .status(400)
        .json({ error: "Missing 'applicationName' parameter" });
    }

    const { rows } = await pool.query(
      "WITH RECURSIVE MenuCTE AS ( SELECT optionid, rootid FROM menuoptionrules WHERE rootid = (SELECT application_id FROM application WHERE name = $1) UNION ALL SELECT mor.optionid, mor.rootid FROM menuoptionrules mor JOIN MenuCTE cte ON mor.rootid = cte.optionid ) SELECT app.application_id, app.name, app.display_name, app.url,app.icon, app.path FROM application app JOIN MenuCTE cte ON app.application_id = cte.optionid;",
      [applicationName],
    );
    res.json(rows);
  } catch (error) {
    console.error("Error executing SQL query:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error, Please Try Again Later." });
  }
});

router.post("/addMenu", async (req, res) => {
  try {
    const { name, url, icon, path, display_name, optionsParent } = req.body;

    // Perform the insertion query
    const result = await pool.query(
      "INSERT INTO application (ad_client_id, name, url, icon, path, display_name) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *",
      [clientId, name, url, icon, path, display_name],
    );
    const application_id = result.rows[0].application_id;
    for (let optionParent of optionsParent) {
      await pool.query(
        "INSERT INTO menuoptionrules (optionid, rootid) VALUES ($1,$2)",
        [application_id, optionParent],
      );
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error executing SQL query:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error, Please Try Again Later." });
  }
});

module.exports = router;
