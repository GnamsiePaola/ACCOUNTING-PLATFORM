const express = require("express")
const mysql = require("mysql2/promise")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const cors = require("cors")
const { v4: uuidv4 } = require("uuid")
require("dotenv").config()

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())

// Database connection
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "accounting_platform",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
}

const pool = mysql.createPool(dbConfig)

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production"

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
  try {
    const { username, email, password } = req.body

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required" })
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" })
    }

    // Check if user already exists
    const [existingUsers] = await pool.execute("SELECT userid FROM users WHERE email = ? OR username = ?", [
      email,
      username,
    ])

    if (existingUsers.length > 0) {
      return res.status(400).json({ error: "User with this email or username already exists" })
    }

    // Hash password
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // Create user
    const userId = uuidv4()
    await pool.execute("INSERT INTO users (userid, username, email, password) VALUES (?, ?, ?, ?)", [
      userId,
      username,
      email,
      hashedPassword,
    ])

    res.status(201).json({ message: "User created successfully" })
  } catch (error) {
    console.error("Registration error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" })
    }

    // Find user
    const [users] = await pool.execute(
      "SELECT userid, username, email, password, is_active FROM users WHERE email = ?",
      [email],
    )

    if (users.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    const user = users[0]

    if (!user.is_active) {
      return res.status(401).json({ error: "Account is deactivated" })
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    // Generate JWT token
    const token = jwt.sign({ userid: user.userid, username: user.username, email: user.email }, JWT_SECRET, {
      expiresIn: "24h",
    })

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

// Business Routes
app.get("/api/businesses", authenticateToken, async (req, res) => {
  try {
    const [businesses] = await pool.execute(
      "SELECT * FROM businesses WHERE user_id = ? AND is_active = TRUE ORDER BY created_at DESC",
      [req.user.userid],
    )
    res.json(businesses)
  } catch (error) {
    console.error("Get businesses error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

app.post("/api/businesses", authenticateToken, async (req, res) => {
  try {
    const { business_name, contact_phone, contact_email, address, tax_id } = req.body

    if (!business_name) {
      return res.status(400).json({ error: "Business name is required" })
    }

    const [result] = await pool.execute(
      "INSERT INTO businesses (business_name, contact_phone, contact_email, address, tax_id, user_id) VALUES (?, ?, ?, ?, ?, ?)",
      [business_name, contact_phone, contact_email, address, tax_id, req.user.userid],
    )

    res.status(201).json({
      message: "Business created successfully",
      business_id: result.insertId,
    })
  } catch (error) {
    console.error("Create business error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Dashboard Stats Route
app.get("/api/dashboard/stats", authenticateToken, async (req, res) => {
  try {
    const { business_id } = req.query

    if (!business_id) {
      return res.status(400).json({ error: "Business ID is required" })
    }

    // Get total income
    const [incomeResult] = await pool.execute(
      "SELECT COALESCE(SUM(amount), 0) as total_income FROM income WHERE business_id = ?",
      [business_id],
    )

    // Get total expenses
    const [expenseResult] = await pool.execute(
      "SELECT COALESCE(SUM(amount), 0) as total_expenses FROM expenses WHERE business_id = ?",
      [business_id],
    )

    // Get client count
    const [clientResult] = await pool.execute(
      "SELECT COUNT(*) as client_count FROM clients WHERE business_id = ? AND is_active = TRUE",
      [business_id],
    )

    // Get recent transactions
    const [transactions] = await pool.execute(
      `SELECT t.*, 
        CASE 
          WHEN t.transaction_type = 'income' THEN i.description
          WHEN t.transaction_type = 'expense' THEN e.description
        END as description,
        CASE 
          WHEN t.transaction_type = 'income' THEN c.client_name
          WHEN t.transaction_type = 'expense' THEN v.vendor_name
        END as party_name
       FROM transactions t
       LEFT JOIN income i ON t.reference_id = i.income_id AND t.transaction_type = 'income'
       LEFT JOIN expenses e ON t.reference_id = e.expense_id AND t.transaction_type = 'expense'
       LEFT JOIN clients c ON i.client_id = c.client_id
       LEFT JOIN vendors v ON e.vendor_id = v.vendor_id
       WHERE t.business_id = ?
       ORDER BY t.created_at DESC
       LIMIT 10`,
      [business_id],
    )

    const totalIncome = Number.parseFloat(incomeResult[0].total_income)
    const totalExpenses = Number.parseFloat(expenseResult[0].total_expenses)
    const netProfit = totalIncome - totalExpenses

    res.json({
      stats: {
        total_income: totalIncome,
        total_expenses: totalExpenses,
        net_profit: netProfit,
        client_count: clientResult[0].client_count,
      },
      recent_transactions: transactions,
    })
  } catch (error) {
    console.error("Dashboard stats error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Accounting Platform API is running" })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: "Something went wrong!" })
})

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
  console.log(`Health check: http://localhost:${PORT}/api/health`)
})

module.exports = app
