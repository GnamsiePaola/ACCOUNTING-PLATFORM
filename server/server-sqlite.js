const express = require("express")
const sqlite3 = require("sqlite3").verbose()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const cors = require("cors")
const { v4: uuidv4 } = require("uuid")
const path = require("path")
require("dotenv").config()

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())

// Database setup
const dbPath = path.join(__dirname, "accounting_platform.db")
const db = new sqlite3.Database(dbPath)

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production"

// Initialize database tables
db.serialize(async () => {
  // Users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    userid TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT 1
  )`)

  // Businesses table
  db.run(`CREATE TABLE IF NOT EXISTS businesses (
    business_id INTEGER PRIMARY KEY AUTOINCREMENT,
    business_name TEXT NOT NULL,
    contact_phone TEXT,
    contact_email TEXT,
    address TEXT,
    tax_id TEXT,
    user_id TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT 1,
    FOREIGN KEY (user_id) REFERENCES users (userid)
  )`)

  // Create default admin user if it doesn't exist
  db.get("SELECT userid FROM users WHERE email = ?", ["admin@business.com"], async (err, row) => {
    if (err) {
      console.error("Error checking for admin user:", err)
      return
    }

    if (!row) {
      try {
        const hashedPassword = await bcrypt.hash("admin123", 10)
        const adminId = uuidv4()

        db.run("INSERT INTO users (userid, username, email, password) VALUES (?, ?, ?, ?)",
          [adminId, "admin", "admin@business.com", hashedPassword],
          function (err) {
            if (err) {
              console.error("Error creating admin user:", err)
            } else {
              console.log("Default admin user created: admin@business.com / admin123")
            }
          }
        )
      } catch (error) {
        console.error("Error hashing admin password:", error)
      }
    } else {
      console.log("Admin user already exists")
    }
  })

  console.log("Database tables initialized")
})

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]

  if (!token) {
    return res.status(401).json({ error: "Access token required" })
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token" })
    }
    req.user = user
    next()
  })
}

// Auth Routes
app.post("/api/auth/register", async (req, res) => {
  console.log("Registration attempt:", req.body)
  try {
    const { username, email, password } = req.body

    // Validation
    if (!username || !email || !password) {
      console.log("Validation failed: missing fields")
      return res.status(400).json({ error: "All fields are required" })
    }

    if (password.length < 6) {
      console.log("Validation failed: password too short")
      return res.status(400).json({ error: "Password must be at least 6 characters" })
    }

    // Check if user already exists
    db.get("SELECT userid FROM users WHERE email = ? OR username = ?", [email, username], async (err, row) => {
      if (err) {
        console.error("Database error:", err)
        return res.status(500).json({ error: "Internal server error" })
      }

      if (row) {
        console.log("User already exists")
        return res.status(400).json({ error: "User with this email or username already exists" })
      }

      try {
        // Hash password
        const saltRounds = 10
        const hashedPassword = await bcrypt.hash(password, saltRounds)

        // Create user
        const userId = uuidv4()
        console.log("Creating user with ID:", userId)

        db.run("INSERT INTO users (userid, username, email, password) VALUES (?, ?, ?, ?)",
          [userId, username, email, hashedPassword],
          function (err) {
            if (err) {
              console.error("Insert error:", err)
              return res.status(500).json({ error: "Internal server error" })
            }
            console.log("User created successfully:", userId)
            res.status(201).json({ message: "User created successfully" })
          }
        )
      } catch (error) {
        console.error("Registration error:", error)
        res.status(500).json({ error: "Internal server error" })
      }
    })
  } catch (error) {
    console.error("Registration error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

app.post("/api/auth/login", async (req, res) => {
  console.log("Login attempt:", req.body)
  try {
    const { email, password } = req.body

    // Validation
    if (!email || !password) {
      console.log("Validation failed: missing email or password")
      return res.status(400).json({ error: "Email and password are required" })
    }

    // Find user
    db.get("SELECT userid, username, email, password, is_active FROM users WHERE email = ?", [email], async (err, user) => {
      if (err) {
        console.error("Database error:", err)
        return res.status(500).json({ error: "Internal server error" })
      }

      if (!user) {
        console.log("User not found:", email)
        return res.status(401).json({ error: "Invalid credentials" })
      }

      if (!user.is_active) {
        console.log("Account deactivated:", email)
        return res.status(401).json({ error: "Account is deactivated" })
      }

      try {
        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password)
        if (!isValidPassword) {
          console.log("Invalid password for:", email)
          return res.status(401).json({ error: "Invalid credentials" })
        }

        // Generate JWT token
        const token = jwt.sign({ userid: user.userid, username: user.username, email: user.email }, JWT_SECRET, {
          expiresIn: "24h",
        })

        console.log("Login successful for:", email)
        // Return user data and token
        res.json({
          message: "Login successful",
          token,
          user: {
            userid: user.userid,
            username: user.username,
            email: user.email,
          },
        })
      } catch (error) {
        console.error("Login error:", error)
        res.status(500).json({ error: "Internal server error" })
      }
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Accounting Platform API is running (SQLite)" })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: "Something went wrong!" })
})

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} (SQLite mode)`)
  console.log(`Health check: http://localhost:${PORT}/api/health`)
})

module.exports = app
