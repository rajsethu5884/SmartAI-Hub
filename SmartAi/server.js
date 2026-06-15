const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const path = require("path");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// MySQL Connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "2006",
    database: "smartaihub"
});

db.connect((err) => {
    if (err) {
        console.log("❌ DB Connection Error:", err.message);
        return;
    }
    console.log("✅ MySQL Connected Successfully");
});

// ================= REGISTER =================
app.post("/register", (req, res) => {

    const {
        name,
        age,
        email,
        role,
        institution,
        place,
        purpose,
        pass
    } = req.body;

    db.query(
        "SELECT * FROM users WHERE email=?",
        [email],
        (err, rows) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            if (rows.length > 0) {
                return res.json({
                    success: false,
                    message: "Email already exists"
                });
            }

            const sql = `
                INSERT INTO users
                (name, age, email, role, institution, place, purpose, password)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;

            db.query(
                sql,
                [name, age, email, role, institution, place, purpose, pass],
                (err, result) => {

                    if (err) {
                        return res.status(500).json({
                            success: false,
                            message: err.message
                        });
                    }

                    res.json({
                        success: true,
                        message: "Registered Successfully"
                    });
                }
            );
        }
    );
});

// ================= LOGIN =================
app.post("/login", (req, res) => {

    const { email, pass } = req.body;

    db.query(
        "SELECT * FROM users WHERE email=?",
        [email],
        (err, rows) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Database Error"
                });
            }

            if (rows.length === 0) {
                return res.json({
                    success: false,
                    message: "User not found"
                });
            }

            if (rows[0].password !== pass) {
                return res.json({
                    success: false,
                    message: "Wrong password"
                });
            }

            res.json({
                success: true,
                user: rows[0]
            });
        }
    );
});

// ================= START SERVER =================
app.listen(5000, () => {
    console.log("🚀 Server running on http://localhost:5000");
});