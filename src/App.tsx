"use client"

import { useState, useEffect } from "react"
import { LoginForm } from "./components/auth/LoginForm"
import { RegisterForm } from "./components/auth/RegisterForm"
import { MainLayout } from "./components/layout/MainLayout"
import "./App.css"

interface User {
  username: string
  email: string
  userid: string
}

function App() {
  const [currentView, setCurrentView] = useState<"login" | "register" | "dashboard">("login")
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Check if user is already logged in (from localStorage or token)
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("user")
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser)
        // Validate that the user object has required properties
        if (parsedUser && parsedUser.username && parsedUser.email) {
          setUser(parsedUser)
          setCurrentView("dashboard")
        } else {
          // Clear invalid user data
          localStorage.removeItem("user")
          localStorage.removeItem("token")
        }
      }
    } catch (error) {
      console.error("Error parsing saved user data:", error)
      // Clear corrupted data
      localStorage.removeItem("user")
      localStorage.removeItem("token")
    }
  }, [])

  const handleLogin = async (credentials: { email: string; password: string }) => {
    setIsLoading(true)
    try {
      console.log("Attempting login with:", credentials.email)

      // Replace with your actual API endpoint
      const response = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      })

      console.log("Login response status:", response.status)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }))
        console.error("Login failed with error:", errorData)
        throw new Error(errorData.error || "Login failed")
      }

      const userData = await response.json()
      console.log("Login successful, user data:", userData)

      // Validate user data structure
      if (userData.user && userData.user.username && userData.user.email) {
        setUser(userData.user)
        localStorage.setItem("user", JSON.stringify(userData.user))
        localStorage.setItem("token", userData.token)
        setCurrentView("dashboard")
      } else {
        throw new Error("Invalid user data received from server")
      }
    } catch (error) {
      console.error("Login error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (userData: { username: string; email: string; password: string }) => {
    setIsLoading(true)
    try {
      console.log("Attempting registration with:", userData.email)

      // Replace with your actual API endpoint
      const response = await fetch("http://localhost:3001/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })

      console.log("Registration response status:", response.status)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }))
        console.error("Registration failed with error:", errorData)
        throw new Error(errorData.error || "Registration failed")
      }

      const result = await response.json()
      console.log("Registration successful:", result)

      // After successful registration, switch to login
      setCurrentView("login")
    } catch (error) {
      console.error("Registration error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    setCurrentView("login")
  }

  if (currentView === "dashboard" && user) {
    return <MainLayout user={user} onLogout={handleLogout} />
  }

  if (currentView === "register") {
    return (
      <RegisterForm onRegister={handleRegister} onSwitchToLogin={() => setCurrentView("login")} isLoading={isLoading} />
    )
  }

  return <LoginForm onLogin={handleLogin} onSwitchToRegister={() => setCurrentView("register")} isLoading={isLoading} />
}

export default App
