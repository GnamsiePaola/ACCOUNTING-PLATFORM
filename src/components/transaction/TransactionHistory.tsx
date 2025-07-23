"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Activity, TrendingUp, TrendingDown, Calendar, Search, Filter, Download } from "lucide-react"

interface Transaction {
  transaction_id: number
  transaction_date: string
  amount: number
  transaction_type: "income" | "expense"
  description: string
  party_name: string
  status: "completed" | "pending" | "cancelled"
  reference_id: string
}

interface TransactionHistoryProps {
  user: { username: string; email: string; userid?: string } | null
}

export function TransactionHistory({ user }: TransactionHistoryProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      transaction_id: 1,
      transaction_date: "2024-03-25",
      amount: 250000,
      transaction_type: "income",
      description: "Website development project",
      party_name: "Tech Solutions SARL",
      status: "completed",
      reference_id: "INV-2024-001"
    },
    {
      transaction_id: 2,
      transaction_date: "2024-03-24",
      amount: 45000,
      transaction_type: "expense",
      description: "Office rent for March",
      party_name: "Property Management Co.",
      status: "completed",
      reference_id: "RENT-2024-03"
    },
    {
      transaction_id: 3,
      transaction_date: "2024-03-23",
      amount: 150000,
      transaction_type: "income",
      description: "Monthly consulting services",
      party_name: "Commerce Plus",
      status: "completed",
      reference_id: "INV-2024-002"
    },
    {
      transaction_id: 4,
      transaction_date: "2024-03-22",
      amount: 25000,
      transaction_type: "expense",
      description: "Office supplies and stationery",
      party_name: "Office Supplies Co.",
      status: "completed",
      reference_id: "SUP-2024-001"
    },
    {
      transaction_id: 5,
      transaction_date: "2024-03-21",
      amount: 75000,
      transaction_type: "income",
      description: "Software license sale",
      party_name: "StartUp Inc",
      status: "pending",
      reference_id: "INV-2024-003"
    },
    {
      transaction_id: 6,
      transaction_date: "2024-03-20",
      amount: 15000,
      transaction_type: "expense",
      description: "Internet and phone bills",
      party_name: "Telecom Provider",
      status: "completed",
      reference_id: "UTIL-2024-03"
    }
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">("all")
  const [filterStatus, setFilterStatus] = useState<"all" | "completed" | "pending" | "cancelled">("all")

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount).replace('XAF', 'FCFA')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.party_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.reference_id.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = filterType === "all" || transaction.transaction_type === filterType
    const matchesStatus = filterStatus === "all" || transaction.status === filterStatus
    
    return matchesSearch && matchesType && matchesStatus
  })

  const getTotalIncome = () => {
    return filteredTransactions
      .filter(t => t.transaction_type === "income" && t.status === "completed")
      .reduce((total, t) => total + t.amount, 0)
  }

  const getTotalExpenses = () => {
    return filteredTransactions
      .filter(t => t.transaction_type === "expense" && t.status === "completed")
      .reduce((total, t) => total + t.amount, 0)
  }

  const getNetAmount = () => {
    return getTotalIncome() - getTotalExpenses()
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transaction History</h1>
          <p className="text-gray-600 mt-1">View and manage all your financial transactions</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(getTotalIncome())}</div>
            <p className="text-xs text-muted-foreground">From filtered transactions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(getTotalExpenses())}</div>
            <p className="text-xs text-muted-foreground">From filtered transactions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Amount</CardTitle>
            <Activity className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getNetAmount() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(getNetAmount())}
            </div>
            <p className="text-xs text-muted-foreground">Income minus expenses</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Filter transactions by type, status, or search terms</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  id="search"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="type-filter">Transaction Type</Label>
              <select
                id="type-filter"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status-filter">Status</Label>
              <select
                id="status-filter"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>&nbsp;</Label>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("")
                  setFilterType("all")
                  setFilterStatus("all")
                }}
                className="w-full"
              >
                <Filter className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transaction List */}
      <Card>
        <CardHeader>
          <CardTitle>Transactions ({filteredTransactions.length})</CardTitle>
          <CardDescription>All financial transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTransactions.map((transaction) => (
              <div key={transaction.transaction_id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-full ${transaction.transaction_type === 'income' ? 'bg-green-100' : 'bg-red-100'}`}>
                    {transaction.transaction_type === 'income' ? (
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium">{transaction.description}</h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>{transaction.party_name}</span>
                      <span>{transaction.reference_id}</span>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(transaction.transaction_date).toLocaleDateString()}</span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(transaction.status)}`}>
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold ${transaction.transaction_type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    {transaction.transaction_type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {filteredTransactions.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your filters or search terms</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("")
                setFilterType("all")
                setFilterStatus("all")
              }}
            >
              Clear All Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
