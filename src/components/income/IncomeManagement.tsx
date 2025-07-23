"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Edit, Trash2, TrendingUp, Calendar, FileText, User } from "lucide-react"

interface Income {
  income_id: number
  income_date: string
  amount: number
  description: string
  invoice_number: string
  client_name: string
  category: string
  created_at: string
}

interface IncomeManagementProps {
  user: { username: string; email: string; userid?: string } | null
}

export function IncomeManagement({ user }: IncomeManagementProps) {
  const [incomes, setIncomes] = useState<Income[]>([
    {
      income_id: 1,
      income_date: "2024-03-15",
      amount: 250000,
      description: "Website development project",
      invoice_number: "INV-2024-001",
      client_name: "Tech Solutions SARL",
      category: "Services",
      created_at: "2024-03-15"
    },
    {
      income_id: 2,
      income_date: "2024-03-20",
      amount: 150000,
      description: "Monthly consulting services",
      invoice_number: "INV-2024-002",
      client_name: "Commerce Plus",
      category: "Consulting",
      created_at: "2024-03-20"
    },
    {
      income_id: 3,
      income_date: "2024-03-25",
      amount: 75000,
      description: "Software license sale",
      invoice_number: "INV-2024-003",
      client_name: "StartUp Inc",
      category: "Products",
      created_at: "2024-03-25"
    }
  ])

  const [showForm, setShowForm] = useState(false)
  const [editingIncome, setEditingIncome] = useState<Income | null>(null)
  const [formData, setFormData] = useState({
    income_date: "",
    amount: "",
    description: "",
    invoice_number: "",
    client_name: "",
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

  const getTotalIncome = () => {
    return incomes.reduce((total, income) => total + income.amount, 0)
  }

  const getMonthlyIncome = () => {
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()
    
    return incomes
      .filter(income => {
        const incomeDate = new Date(income.income_date)
        return incomeDate.getMonth() === currentMonth && incomeDate.getFullYear() === currentYear
      })
      .reduce((total, income) => total + income.amount, 0)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const incomeData = {
      ...formData,
      amount: parseFloat(formData.amount) || 0
    }

    if (editingIncome) {
      setIncomes(incomes.map(income => 
        income.income_id === editingIncome.income_id 
          ? { ...income, ...incomeData }
          : income
      ))
    } else {
      const newIncome: Income = {
        income_id: Date.now(),
        ...incomeData,
        created_at: new Date().toISOString().split('T')[0]
      }
      setIncomes([...incomes, newIncome])
    }

    setFormData({
      income_date: "",
      amount: "",
      description: "",
      invoice_number: "",
      client_name: "",
      category: ""
    })
    setShowForm(false)
    setEditingIncome(null)
  }

  const handleEdit = (income: Income) => {
    setEditingIncome(income)
    setFormData({
      income_date: income.income_date,
      amount: income.amount.toString(),
      description: income.description,
      invoice_number: income.invoice_number,
      client_name: income.client_name,
      category: income.category
    })
    setShowForm(true)
  }

  const handleDelete = (incomeId: number) => {
    if (confirm("Are you sure you want to delete this income record?")) {
      setIncomes(incomes.filter(income => income.income_id !== incomeId))
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
          <h1 className="text-3xl font-bold text-gray-900">Income Management</h1>
          <p className="text-gray-600 mt-1">Track and manage your revenue streams</p>
        </div>
        <Button 
          onClick={() => setShowForm(true)}
          className="bg-green-600 hover:bg-green-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Income
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(getTotalIncome())}</div>
            <p className="text-xs text-muted-foreground">All time revenue</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{formatCurrency(getMonthlyIncome())}</div>
            <p className="text-xs text-muted-foreground">Current month revenue</p>
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingIncome ? "Edit Income" : "Add New Income"}</CardTitle>
            <CardDescription>
              {editingIncome ? "Update income record" : "Record a new income transaction"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="income_date">Date *</Label>
                  <Input
                    id="income_date"
                    name="income_date"
                    type="date"
                    value={formData.income_date}
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
                  <Label htmlFor="client_name">Client Name</Label>
                  <Input
                    id="client_name"
                    name="client_name"
                    value={formData.client_name}
                    onChange={handleChange}
                    placeholder="Enter client name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="invoice_number">Invoice Number</Label>
                  <Input
                    id="invoice_number"
                    name="invoice_number"
                    value={formData.invoice_number}
                    onChange={handleChange}
                    placeholder="INV-2024-001"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="e.g., Services, Products, Consulting"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Input
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter income description"
                    required
                  />
                </div>
              </div>
              <div className="flex space-x-2">
                <Button type="submit" className="bg-green-600 hover:bg-green-700">
                  {editingIncome ? "Update Income" : "Add Income"}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setShowForm(false)
                    setEditingIncome(null)
                    setFormData({
                      income_date: "",
                      amount: "",
                      description: "",
                      invoice_number: "",
                      client_name: "",
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

      {/* Income List */}
      <Card>
        <CardHeader>
          <CardTitle>Income Records</CardTitle>
          <CardDescription>Recent income transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {incomes.map((income) => (
              <div key={income.income_id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-green-100 rounded-full">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">{income.description}</h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      {income.client_name && (
                        <div className="flex items-center space-x-1">
                          <User className="h-3 w-3" />
                          <span>{income.client_name}</span>
                        </div>
                      )}
                      {income.invoice_number && (
                        <div className="flex items-center space-x-1">
                          <FileText className="h-3 w-3" />
                          <span>{income.invoice_number}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(income.income_date).toLocaleDateString()}</span>
                      </div>
                      {income.category && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                          {income.category}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">
                      {formatCurrency(income.amount)}
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(income)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(income.income_id)}
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

      {incomes.length === 0 && !showForm && (
        <Card>
          <CardContent className="text-center py-12">
            <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No income records found</h3>
            <p className="text-gray-600 mb-4">Start tracking your revenue by adding your first income</p>
            <Button onClick={() => setShowForm(true)} className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Income
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
