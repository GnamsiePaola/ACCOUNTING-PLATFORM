"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Edit, Trash2, TrendingDown, Calendar, FileText, Building } from "lucide-react"

interface Expense {
  expense_id: number
  expense_date: string
  amount: number
  description: string
  receipt_number: string
  vendor_name: string
  category: string
  created_at: string
}

interface ExpenseManagementProps {
  user: { username: string; email: string; userid?: string } | null
}

export function ExpenseManagement({ user }: ExpenseManagementProps) {
  const [expenses, setExpenses] = useState<Expense[]>([
    {
      expense_id: 1,
      expense_date: "2024-03-15",
      amount: 45000,
      description: "Office rent for March",
      receipt_number: "RENT-2024-03",
      vendor_name: "Property Management Co.",
      category: "Rent",
      created_at: "2024-03-15"
    },
    {
      expense_id: 2,
      expense_date: "2024-03-18",
      amount: 25000,
      description: "Office supplies and stationery",
      receipt_number: "SUP-2024-001",
      vendor_name: "Office Supplies Co.",
      category: "Office Supplies",
      created_at: "2024-03-18"
    },
    {
      expense_id: 3,
      expense_date: "2024-03-20",
      amount: 15000,
      description: "Internet and phone bills",
      receipt_number: "UTIL-2024-03",
      vendor_name: "Telecom Provider",
      category: "Utilities",
      created_at: "2024-03-20"
    },
    {
      expense_id: 4,
      expense_date: "2024-03-22",
      amount: 8000,
      description: "Fuel for company vehicle",
      receipt_number: "FUEL-2024-001",
      vendor_name: "Gas Station",
      category: "Transportation",
      created_at: "2024-03-22"
    }
  ])

  const [showForm, setShowForm] = useState(false)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  const [formData, setFormData] = useState({
    expense_date: "",
    amount: "",
    description: "",
    receipt_number: "",
    vendor_name: "",
    category: ""
  })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount).replace('XAF', 'FCFA')
  }

  const getTotalExpenses = () => {
    return expenses.reduce((total, expense) => total + expense.amount, 0)
  }

  const getMonthlyExpenses = () => {
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()
    
    return expenses
      .filter(expense => {
        const expenseDate = new Date(expense.expense_date)
        return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear
      })
      .reduce((total, expense) => total + expense.amount, 0)
  }

  const getExpensesByCategory = () => {
    const categoryTotals: { [key: string]: number } = {}
    expenses.forEach(expense => {
      if (expense.category) {
        categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount
      }
    })
    return Object.entries(categoryTotals)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const expenseData = {
      ...formData,
      amount: parseFloat(formData.amount) || 0
    }

    if (editingExpense) {
      setExpenses(expenses.map(expense => 
        expense.expense_id === editingExpense.expense_id 
          ? { ...expense, ...expenseData }
          : expense
      ))
    } else {
      const newExpense: Expense = {
        expense_id: Date.now(),
        ...expenseData,
        created_at: new Date().toISOString().split('T')[0]
      }
      setExpenses([...expenses, newExpense])
    }

    setFormData({
      expense_date: "",
      amount: "",
      description: "",
      receipt_number: "",
      vendor_name: "",
      category: ""
    })
    setShowForm(false)
    setEditingExpense(null)
  }

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense)
    setFormData({
      expense_date: expense.expense_date,
      amount: expense.amount.toString(),
      description: expense.description,
      receipt_number: expense.receipt_number,
      vendor_name: expense.vendor_name,
      category: expense.category
    })
    setShowForm(true)
  }

  const handleDelete = (expenseId: number) => {
    if (confirm("Are you sure you want to delete this expense record?")) {
      setExpenses(expenses.filter(expense => expense.expense_id !== expenseId))
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Expense Management</h1>
          <p className="text-gray-600 mt-1">Track and manage your business expenses</p>
        </div>
        <Button 
          onClick={() => setShowForm(true)}
          className="bg-red-600 hover:bg-red-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Expense
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(getTotalExpenses())}</div>
            <p className="text-xs text-muted-foreground">All time expenses</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Calendar className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{formatCurrency(getMonthlyExpenses())}</div>
            <p className="text-xs text-muted-foreground">Current month expenses</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Category</CardTitle>
            <Building className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            {getExpensesByCategory().length > 0 ? (
              <>
                <div className="text-2xl font-bold text-purple-600">
                  {formatCurrency(getExpensesByCategory()[0][1])}
                </div>
                <p className="text-xs text-muted-foreground">{getExpensesByCategory()[0][0]}</p>
              </>
            ) : (
              <div className="text-2xl font-bold text-gray-400">No data</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingExpense ? "Edit Expense" : "Add New Expense"}</CardTitle>
            <CardDescription>
              {editingExpense ? "Update expense record" : "Record a new business expense"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expense_date">Date *</Label>
                  <Input
                    id="expense_date"
                    name="expense_date"
                    type="date"
                    value={formData.expense_date}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (FCFA) *</Label>
                  <Input
                    id="amount"
                    name="amount"
                    type="number"
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vendor_name">Vendor/Supplier</Label>
                  <Input
                    id="vendor_name"
                    name="vendor_name"
                    value={formData.vendor_name}
                    onChange={handleChange}
                    placeholder="Enter vendor name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="receipt_number">Receipt Number</Label>
                  <Input
                    id="receipt_number"
                    name="receipt_number"
                    value={formData.receipt_number}
                    onChange={handleChange}
                    placeholder="REC-2024-001"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="e.g., Rent, Utilities, Office Supplies"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Input
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter expense description"
                    required
                  />
                </div>
              </div>
              <div className="flex space-x-2">
                <Button type="submit" className="bg-red-600 hover:bg-red-700">
                  {editingExpense ? "Update Expense" : "Add Expense"}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setShowForm(false)
                    setEditingExpense(null)
                    setFormData({
                      expense_date: "",
                      amount: "",
                      description: "",
                      receipt_number: "",
                      vendor_name: "",
                      category: ""
                    })
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Expense List */}
      <Card>
        <CardHeader>
          <CardTitle>Expense Records</CardTitle>
          <CardDescription>Recent business expenses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {expenses.map((expense) => (
              <div key={expense.expense_id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-red-100 rounded-full">
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">{expense.description}</h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      {expense.vendor_name && (
                        <div className="flex items-center space-x-1">
                          <Building className="h-3 w-3" />
                          <span>{expense.vendor_name}</span>
                        </div>
                      )}
                      {expense.receipt_number && (
                        <div className="flex items-center space-x-1">
                          <FileText className="h-3 w-3" />
                          <span>{expense.receipt_number}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(expense.expense_date).toLocaleDateString()}</span>
                      </div>
                      {expense.category && (
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                          {expense.category}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="text-right">
                    <div className="text-lg font-bold text-red-600">
                      -{formatCurrency(expense.amount)}
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(expense)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(expense.expense_id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {expenses.length === 0 && !showForm && (
        <Card>
          <CardContent className="text-center py-12">
            <TrendingDown className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No expense records found</h3>
            <p className="text-gray-600 mb-4">Start tracking your expenses by adding your first expense</p>
            <Button onClick={() => setShowForm(true)} className="bg-red-600 hover:bg-red-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Expense
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
