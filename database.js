import sqlite3 from "sqlite3";
import axios from "axios";

const url = "https://gist.githubusercontent.com/faizaanmadhani/6bf87ac6d8975b2bd45aba9fd96515ca/raw/795f99b519d6e2c33bb2b89c0707be7f06cff95d/HTN_2023_BE_Challenge_Data.json";

// Get user data
const res = await axios.get(url);
const userData = res.data;

// List of skill names and frequency
var skillsFrequency = {};

// Create list of user data to insert
var userDataToInsert = [];
for (let i = 0; i < userData.length; i++) {
    let user = userData[i];
    const { name } = user;
    const { company } = user;
    const { email } = user;
    const { phone } = user;
    const { skills } = user;

    // Reorganize skills structure
    const skillsObject = {};

    for (let j = 0; j < skills.length; j++) {
        skillsObject[skills[j].skill] = skills[j].rating;

        // Update set of skills to insert
        let count = skillsFrequency[skills[j].skill] || 0;
        skillsFrequency[skills[j].skill] = count + 1;
    }
    const skillsJson = JSON.stringify(skillsObject);

    userDataToInsert.push([name, company, email, phone, skillsJson]);
}

// Create a database if none exists
const database = new sqlite3.Database("hackers.db", (err) => {
    if (err) {
        // Return error message
        console.error(err.message);
        throw err;
    } else {
        console.log("Connected to the SQLite database.");
        // Create table
        // Constraint on phone number being unique to prevent duplicate rows
        database.run(
            `CREATE TABLE user(
                        id INTEGER PRIMARY KEY,
                        name text,
                        company text,
                        email text,
                        phone text UNIQUE,
                        skills text,
                        CONSTRAINT phone_unique UNIQUE (phone)
                        )`,
            (err) => {
                if (err) {
                    console.error("Table already created.");
                } else {
                    // Table just created, fill database with user data
                    const insert = `INSERT INTO user (name, company, email, phone, skills)
                    VALUES (?, ?, ?, ?, ?)`;

                    for (let i = 0; i < userDataToInsert.length; i++) {
                        database.run(
                            insert,
                            userDataToInsert[i],
                            (err) => {
                                if (err) console.log(err.message);
                            });
                    }
                }
            }
        );

        // Create skills table
        database.run(`CREATE TABLE skill (
                        id integer PRIMARY KEY,
                        name text,
                        frequency integer
                        )`,
            (err) => {
                if (err) {
                    console.error("Skills table already created.");
                } else {
                    // Table just created, fill with skills data
                    const skillsToInsert = Object.entries(skillsFrequency);
                    const insert = `INSERT INTO skill (name, frequency) VALUES (?, ?)`;

                    for (let i = 0; i < skillsToInsert.length; i++) {
                        database.run(
                            insert,
                            skillsToInsert[i],
                            (err) => {
                                if (err) console.log(err.message);
                            });
                    }
                }
            });
    }
});

export { database };