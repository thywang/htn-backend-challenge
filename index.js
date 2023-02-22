import express from "express";
import { database } from "./database.js";

const port = process.env.PORT || 3000;
const app = express();

app.listen(port, () => {
  console.log(`Example REST Express app listening at http://localhost:${port}`);
});

app.use(express.json());

/* Test command */

app.get("/", (req, res) => {
  res.send("Welcome!");
});

/* Get list of users */

app.get("/users", (req, res, next) => {
  const sql = "SELECT * FROM user";
  const params = [];
  database.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }

    // Check if result is defined
    if (rows) {
      // Parse json for nicer formatting
      for (let i = 0; i < rows.length; i++) {
        rows[i].skills = JSON.parse(rows[i].skills);
      }
    }

    res.json({
      "message": "success",
      "data": rows
    });
  });
});

/* Get single user by id */

app.get("/users/:id", (req, res, next) => {
  const sql = "SELECT * FROM user WHERE id = ?";
  const params = [req.params.id];
  database.get(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }

    // Check if result is defined
    if (row) {
      // Parse json for nicer formatting
      row.skills = JSON.parse(row.skills);
    }

    res.json({
      "message": "success",
      "data": row
    });
  });
});

/* Update single user by id */

app.put("/users/:id", (req, res, next) => {

  // Fetch user profile if there is one
  let profile = {};
  const sql = "SELECT * FROM user WHERE id = ?";
  let params = [req.params.id];

  database.get(sql, params, (err, row) => {
    if (err) {
      profile = {};
    }
    // Check if result is defined
    if (row) {
      // Parse json for nicer formatting
      row.skills = JSON.parse(row.skills);
      profile = row;
    }

    let skills;

    if (req.body.skills) {
      skills = { ...profile.skills, ...req.body.skills };
    } else {
      skills = profile.skills;
    }

    const data = {
      name: req.body.name ? req.body.name : profile.name,
      company: req.body.company ? req.body.company : profile.company,
      email: req.body.email ? req.body.email : profile.email,
      phone: req.body.phone ? req.body.phone : profile.phone,
      skills: skills
    };

    const update = `UPDATE user 
                    SET name = ?,
                        company = COALESCE(?,company),
                        email = COALESCE(?,email),
                        phone = COALESCE(?,phone),
                        skills = ?
                    WHERE id = ?`;

    // Reorganize skills structure
    const skillsJson = JSON.stringify(data.skills);

    params = [data.name, data.company, data.email, data.phone, skillsJson, req.params.id];

    database.run(update, params, (err, result) => {
      if (err) {
        res.status(400).json({ "error": res.message });
        return;
      }

      res.json({
        message: "success",
        data: data
      });
    });
  });
});

/* Get a list of skills and aggregate info about them */

app.get("/skills/", (req, res, next) => {
  const sql = "SELECT * FROM skill WHERE frequency BETWEEN ? AND ?";
  const params = [req.query.min_frequency, req.query.max_frequency];
  database.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    // Drop the id field
    const data = rows.map(row => {
      delete row.id;
      return row;
    });

    res.json({
      "message": "success",
      "data": data
    });
  });
});