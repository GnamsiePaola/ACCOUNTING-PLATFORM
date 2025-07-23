"use client"

import { useState } from "react"
import { Sidebar } from "./Sidebar"
import { Dashboard } from "../dashboard/Dashboard"
import { BusinessManagement } from "../business/BusinessManagement"
import { VendorManagement } from "../vendor/VendorManagement"
import { ProductManagement } from "../product/ProductManagement"
import { IncomeManagement } from "../income/IncomeManagement"
import { ExpenseManagement } from "../expense/ExpenseManagement"
import { TransactionHistory } from "../transaction/TransactionHistory"
import { ReportsManagement } from "../reports/ReportsManagement"
import { SettingsManagement } from "../settings/SettingsManagement"

interface MainLayoutProps {
  user: { username: string; email: string; userid?: string } | null
  onLogout: () => void
}

export function MainLayout({ user, onLogout }: MainLayoutProps) {
  // Safety check - if user is null or invalid, show error state
  if (!user || !user.username || !user.email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Session Error</h2>
          <p className="text-gray-600 mb-4">Unable to load user information</p>
          <button
            onClick={onLogout}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Return to Login
          </button>
        </div>
      </div>
    )
  }
  const [activeItem, setActiveItem] = useState("dashboard")

  const renderContent = () => {
    switch (activeItem) {
      case "dashboard":
        return <Dashboard user={user} />
      case "businesses":
        return <BusinessManagement user={user} />
      case "clients":
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Clients</h1>
            <p className="text-gray-600">Manage your clients here.</p>
          </div>
        )
      case "vendors":
        return <VendorManagement user={user} />
      case "products":
        return <ProductManagement user={user} />
      case "income":
        return <IncomeManagement user={user} />
      case "expenses":
        return <ExpenseManagement user={user} />
      case "transactions":
        return <TransactionHistory user={user} />
      case "reports":
        return <ReportsManagement user={user} />
      case "settings":
        return <SettingsManagement user={user} />
      default:
        return <Dashboard user={user} />
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar activeItem={activeItem} onItemClick={setActiveItem} onLogout={onLogout} user={user} />
      <main className="flex-1 overflow-auto">{renderContent()}</main>
    </div>
  )
}
