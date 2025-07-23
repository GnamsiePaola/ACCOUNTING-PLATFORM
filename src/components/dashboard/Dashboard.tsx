import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, DollarSign, Users, Package, Building2, Activity, Calendar } from "lucide-react"

interface DashboardProps {
  user: { username: string; email: string; userid?: string } | null
}

export function Dashboard({ user }: DashboardProps) {
  // Safety check for user
  if (!user || !user.username) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Loading...</h2>
          <p className="text-gray-600">Please wait while we load your dashboard</p>
        </div>
      </div>
    )
  }
  // Format currency in FCFA
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount).replace('XAF', 'FCFA')
  }

  // In a real app, this data would come from your API
  const stats = [
    {
      title: "Total Revenue",
      value: formatCurrency(2750000),
      change: "+20.1% from last month",
      icon: DollarSign,
      trend: "up",
    },
    {
      title: "Total Expenses",
      value: formatCurrency(850000),
      change: "+4.3% from last month",
      icon: TrendingDown,
      trend: "up",
    },
    {
      title: "Net Profit",
      value: formatCurrency(1900000),
      change: "+15.8% from last month",
      icon: TrendingUp,
      trend: "up",
    },
    {
      title: "Active Clients",
      value: "24",
      change: "+2 new this month",
      icon: Users,
      trend: "up",
    },
  ]

  const recentTransactions = [
    { id: 1, type: "Income", client: "ABC Corp", amount: formatCurrency(150000), date: "2025-01-20", status: "Completed" },
    {
      id: 2,
      type: "Expense",
      vendor: "Office Supplies Co",
      amount: formatCurrency(27000),
      date: "2025-01-19",
      status: "Completed",
    },
    { id: 3, type: "Income", client: "XYZ Ltd", amount: formatCurrency(108000), date: "2025-01-18", status: "Pending" },
    { id: 4, type: "Expense", vendor: "Utilities Inc", amount: formatCurrency(19200), date: "2025-01-17", status: "Completed" },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.username}!</h1>
          <p className="text-gray-600 mt-1">Here&apos;s what&apos;s happening with your business today.</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Calendar className="h-4 w-4" />
          <span>
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <p className="text-xs text-green-600 mt-1">{stat.change}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Recent Transactions</span>
            </CardTitle>
            <CardDescription>Your latest financial activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-2 h-2 rounded-full ${transaction.type === "Income" ? "bg-green-500" : "bg-red-500"
                        }`}
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{transaction.client || transaction.vendor}</p>
                      <p className="text-xs text-gray-500">{transaction.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-sm font-medium ${transaction.type === "Income" ? "text-green-600" : "text-red-600"
                        }`}
                    >
                      {transaction.type === "Income" ? "+" : "-"}
                      {transaction.amount}
                    </p>
                    <p className="text-xs text-gray-500">{transaction.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Package className="h-5 w-5" />
              <span>Quick Actions</span>
            </CardTitle>
            <CardDescription>Common tasks to get you started</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-left transition-colors">
                <Building2 className="h-6 w-6 text-blue-600 mb-2" />
                <p className="text-sm font-medium text-gray-900">Add Business</p>
                <p className="text-xs text-gray-500">Create new business</p>
              </button>
              <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-left transition-colors">
                <Users className="h-6 w-6 text-green-600 mb-2" />
                <p className="text-sm font-medium text-gray-900">Add Client</p>
                <p className="text-xs text-gray-500">Register new client</p>
              </button>
              <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-left transition-colors">
                <TrendingUp className="h-6 w-6 text-purple-600 mb-2" />
                <p className="text-sm font-medium text-gray-900">Record Income</p>
                <p className="text-xs text-gray-500">Add new income</p>
              </button>
              <button className="p-4 bg-red-50 hover:bg-red-100 rounded-lg text-left transition-colors">
                <TrendingDown className="h-6 w-6 text-red-600 mb-2" />
                <p className="text-sm font-medium text-gray-900">Add Expense</p>
                <p className="text-xs text-gray-500">Record new expense</p>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
