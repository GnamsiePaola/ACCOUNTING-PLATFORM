"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Download, 
  FileText, 
  PieChart, 
  DollarSign,
  Building2,
  Package,
  Users,
  Filter,
  Eye
} from "lucide-react"

interface ReportsManagementProps {
  user: { username: string; email: string; userid?: string } | null
}

export function ReportsManagement({ user }: ReportsManagementProps) {
  const [selectedReport, setSelectedReport] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState({
    startDate: "2024-01-01",
    endDate: "2024-12-31"
  })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount).replace('XAF', 'FCFA')
  }

  // Sample data for reports
  const reportData = {
    profitLoss: {
      totalIncome: 2750000,
      totalExpenses: 850000,
      netProfit: 1900000,
      grossMargin: 69.1
    },
    monthlyTrends: [
      { month: "Jan", income: 450000, expenses: 120000 },
      { month: "Feb", income: 380000, expenses: 95000 },
      { month: "Mar", income: 520000, expenses: 140000 },
      { month: "Apr", income: 420000, expenses: 110000 },
      { month: "May", income: 480000, expenses: 125000 },
      { month: "Jun", income: 500000, expenses: 160000 }
    ],
    expensesByCategory: [
      { category: "Rent", amount: 270000, percentage: 31.8 },
      { category: "Office Supplies", amount: 150000, percentage: 17.6 },
      { category: "Utilities", amount: 90000, percentage: 10.6 },
      { category: "Transportation", amount: 80000, percentage: 9.4 },
      { category: "Marketing", amount: 120000, percentage: 14.1 },
      { category: "Others", amount: 140000, percentage: 16.5 }
    ],
    incomeByClient: [
      { client: "Tech Solutions SARL", amount: 750000, percentage: 27.3 },
      { client: "Commerce Plus", amount: 650000, percentage: 23.6 },
      { client: "StartUp Inc", amount: 450000, percentage: 16.4 },
      { client: "Mobile Co", amount: 400000, percentage: 14.5 },
      { client: "Others", amount: 500000, percentage: 18.2 }
    ]
  }

  const reportTypes = [
    {
      id: "profit-loss",
      title: "Profit & Loss Statement",
      description: "Comprehensive income and expense analysis",
      icon: TrendingUp,
      color: "bg-green-500"
    },
    {
      id: "cash-flow",
      title: "Cash Flow Report",
      description: "Track money in and out of your business",
      icon: DollarSign,
      color: "bg-blue-500"
    },
    {
      id: "expense-analysis",
      title: "Expense Analysis",
      description: "Detailed breakdown of business expenses",
      icon: TrendingDown,
      color: "bg-red-500"
    },
    {
      id: "income-analysis",
      title: "Income Analysis",
      description: "Revenue breakdown by clients and categories",
      icon: BarChart3,
      color: "bg-purple-500"
    },
    {
      id: "business-performance",
      title: "Business Performance",
      description: "Overall business metrics and KPIs",
      icon: Building2,
      color: "bg-orange-500"
    },
    {
      id: "inventory-report",
      title: "Inventory Report",
      description: "Stock levels and product performance",
      icon: Package,
      color: "bg-indigo-500"
    },
    {
      id: "client-report",
      title: "Client Report",
      description: "Client analysis and payment history",
      icon: Users,
      color: "bg-teal-500"
    },
    {
      id: "tax-report",
      title: "Tax Report",
      description: "Tax calculations and compliance data",
      icon: FileText,
      color: "bg-gray-500"
    }
  ]

  const handleGenerateReport = (reportId: string) => {
    setSelectedReport(reportId)
  }

  const handleExportReport = (format: string) => {
    alert(`Exporting report as ${format.toUpperCase()}...`)
  }

  const renderProfitLossReport = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Income</p>
                <p className="text-xl font-bold text-green-600">{formatCurrency(reportData.profitLoss.totalIncome)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingDown className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Expenses</p>
                <p className="text-xl font-bold text-red-600">{formatCurrency(reportData.profitLoss.totalExpenses)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Net Profit</p>
                <p className="text-xl font-bold text-blue-600">{formatCurrency(reportData.profitLoss.netProfit)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <PieChart className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Profit Margin</p>
                <p className="text-xl font-bold text-purple-600">{reportData.profitLoss.grossMargin}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Trends</CardTitle>
            <CardDescription>Income vs Expenses over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportData.monthlyTrends.map((month, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="font-medium">{month.month}</span>
                  <div className="flex space-x-4">
                    <span className="text-green-600">{formatCurrency(month.income)}</span>
                    <span className="text-red-600">{formatCurrency(month.expenses)}</span>
                    <span className="font-bold">{formatCurrency(month.income - month.expenses)}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Expense Breakdown</CardTitle>
            <CardDescription>Expenses by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {reportData.expensesByCategory.map((category, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{category.category}</span>
                    <span>{category.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full" 
                      style={{ width: `${category.percentage}%` }}
                    ></div>
                  </div>
                  <div className="text-right text-sm text-gray-600">
                    {formatCurrency(category.amount)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderIncomeAnalysisReport = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Income by Client</CardTitle>
          <CardDescription>Revenue breakdown by top clients</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reportData.incomeByClient.map((client, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{client.client}</span>
                  <div className="text-right">
                    <div className="font-bold text-green-600">{formatCurrency(client.amount)}</div>
                    <div className="text-sm text-gray-600">{client.percentage}%</div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-green-500 h-3 rounded-full" 
                    style={{ width: `${client.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Financial Reports</h1>
          <p className="text-gray-600 mt-1">Generate comprehensive business reports and analytics</p>
        </div>
        {selectedReport && (
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => handleExportReport('pdf')}>
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
            <Button variant="outline" onClick={() => handleExportReport('excel')}>
              <Download className="h-4 w-4 mr-2" />
              Export Excel
            </Button>
          </div>
        )}
      </div>

      {/* Date Range Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Report Parameters</CardTitle>
          <CardDescription>Select date range and filters for your reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-date">Start Date</Label>
              <Input
                id="start-date"
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-date">End Date</Label>
              <Input
                id="end-date"
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>&nbsp;</Label>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                <Filter className="h-4 w-4 mr-2" />
                Apply Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Types */}
      {!selectedReport && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reportTypes.map((report) => {
            const IconComponent = report.icon
            return (
              <Card key={report.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`p-2 rounded-full ${report.color}`}>
                      <IconComponent className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{report.title}</h3>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{report.description}</p>
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      onClick={() => handleGenerateReport(report.id)}
                      className="flex-1"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleExportReport('pdf')}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Report Content */}
      {selectedReport && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">
              {reportTypes.find(r => r.id === selectedReport)?.title}
            </h2>
            <Button variant="outline" onClick={() => setSelectedReport(null)}>
              Back to Reports
            </Button>
          </div>

          {selectedReport === 'profit-loss' && renderProfitLossReport()}
          {selectedReport === 'income-analysis' && renderIncomeAnalysisReport()}
          
          {!['profit-loss', 'income-analysis'].includes(selectedReport) && (
            <Card>
              <CardContent className="text-center py-12">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Report Coming Soon</h3>
                <p className="text-gray-600">This report is being developed and will be available soon.</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
