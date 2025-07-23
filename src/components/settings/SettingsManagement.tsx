"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Database, 
  Download,
  Upload,
  Trash2,
  Save,
  Eye,
  EyeOff,
  Mail,
  Phone,
  Building,
  CreditCard,
  Lock
} from "lucide-react"

interface SettingsManagementProps {
  user: { username: string; email: string; userid?: string } | null
}

export function SettingsManagement({ user }: SettingsManagementProps) {
  const [activeTab, setActiveTab] = useState("profile")
  const [showPassword, setShowPassword] = useState(false)
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    lowStockAlerts: true,
    paymentReminders: true,
    reportGeneration: false
  })

  const [profileData, setProfileData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    fullName: "John Doe",
    phone: "+237 6XX XXX XXX",
    company: "My Business SARL",
    position: "CEO",
    address: "Douala, Cameroon",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })

  const [businessSettings, setBusinessSettings] = useState({
    businessName: "My Business SARL",
    taxId: "CM123456789",
    currency: "FCFA",
    fiscalYearStart: "01-01",
    timeZone: "Africa/Douala",
    language: "French",
    dateFormat: "DD/MM/YYYY",
    numberFormat: "1,234.56"
  })

  const [systemSettings, setSystemSettings] = useState({
    autoBackup: true,
    backupFrequency: "daily",
    dataRetention: "2-years",
    twoFactorAuth: false,
    sessionTimeout: "30-minutes",
    auditLog: true
  })

  const handleProfileUpdate = () => {
    // Validate passwords if changing
    if (profileData.newPassword && profileData.newPassword !== profileData.confirmPassword) {
      alert("New passwords do not match!")
      return
    }

    alert("Profile updated successfully!")
  }

  const handleBusinessSettingsUpdate = () => {
    alert("Business settings updated successfully!")
  }

  const handleNotificationUpdate = () => {
    alert("Notification preferences updated successfully!")
  }

  const handleSystemSettingsUpdate = () => {
    alert("System settings updated successfully!")
  }

  const handleExportData = () => {
    alert("Exporting all data... This may take a few minutes.")
  }

  const handleImportData = () => {
    alert("Please select a file to import data from.")
  }

  const handleDeleteAccount = () => {
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      alert("Account deletion initiated. You will receive a confirmation email.")
    }
  }

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "business", label: "Business", icon: Building },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "system", label: "System", icon: Settings },
    { id: "data", label: "Data", icon: Database }
  ]

  const renderProfileSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your personal details and contact information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={profileData.fullName}
                onChange={(e) => setProfileData(prev => ({ ...prev, fullName: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={profileData.username}
                onChange={(e) => setProfileData(prev => ({ ...prev, username: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="phone"
                  value={profileData.phone}
                  onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                value={profileData.company}
                onChange={(e) => setProfileData(prev => ({ ...prev, company: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                value={profileData.position}
                onChange={(e) => setProfileData(prev => ({ ...prev, position: e.target.value }))}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={profileData.address}
                onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
              />
            </div>
          </div>
          <Button onClick={handleProfileUpdate} className="bg-blue-600 hover:bg-blue-700">
            <Save className="h-4 w-4 mr-2" />
            Update Profile
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>Update your account password for security</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="currentPassword"
                type={showPassword ? "text" : "password"}
                value={profileData.currentPassword}
                onChange={(e) => setProfileData(prev => ({ ...prev, currentPassword: e.target.value }))}
                className="pl-10 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3"
              >
                {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={profileData.newPassword}
                onChange={(e) => setProfileData(prev => ({ ...prev, newPassword: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={profileData.confirmPassword}
                onChange={(e) => setProfileData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              />
            </div>
          </div>
          <Button onClick={handleProfileUpdate} className="bg-green-600 hover:bg-green-700">
            <Save className="h-4 w-4 mr-2" />
            Change Password
          </Button>
        </CardContent>
      </Card>
    </div>
  )

  const renderBusinessSettings = () => (
    <Card>
      <CardHeader>
        <CardTitle>Business Configuration</CardTitle>
        <CardDescription>Configure your business settings and preferences</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="businessName">Business Name</Label>
            <Input
              id="businessName"
              value={businessSettings.businessName}
              onChange={(e) => setBusinessSettings(prev => ({ ...prev, businessName: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="taxId">Tax ID</Label>
            <Input
              id="taxId"
              value={businessSettings.taxId}
              onChange={(e) => setBusinessSettings(prev => ({ ...prev, taxId: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="currency">Default Currency</Label>
            <select
              id="currency"
              value={businessSettings.currency}
              onChange={(e) => setBusinessSettings(prev => ({ ...prev, currency: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="FCFA">FCFA (Central African Franc)</option>
              <option value="USD">USD (US Dollar)</option>
              <option value="EUR">EUR (Euro)</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="fiscalYearStart">Fiscal Year Start</Label>
            <Input
              id="fiscalYearStart"
              value={businessSettings.fiscalYearStart}
              onChange={(e) => setBusinessSettings(prev => ({ ...prev, fiscalYearStart: e.target.value }))}
              placeholder="MM-DD"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="timeZone">Time Zone</Label>
            <select
              id="timeZone"
              value={businessSettings.timeZone}
              onChange={(e) => setBusinessSettings(prev => ({ ...prev, timeZone: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Africa/Douala">Africa/Douala</option>
              <option value="Africa/Yaounde">Africa/Yaounde</option>
              <option value="UTC">UTC</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <select
              id="language"
              value={businessSettings.language}
              onChange={(e) => setBusinessSettings(prev => ({ ...prev, language: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="French">Français</option>
              <option value="English">English</option>
            </select>
          </div>
        </div>
        <Button onClick={handleBusinessSettingsUpdate} className="bg-blue-600 hover:bg-blue-700">
          <Save className="h-4 w-4 mr-2" />
          Save Business Settings
        </Button>
      </CardContent>
    </Card>
  )

  const renderNotificationSettings = () => (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>Choose how you want to receive notifications</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {Object.entries(notifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </h4>
                <p className="text-sm text-gray-600">
                  {key === 'emailNotifications' && 'Receive notifications via email'}
                  {key === 'smsNotifications' && 'Receive notifications via SMS'}
                  {key === 'pushNotifications' && 'Receive push notifications in browser'}
                  {key === 'lowStockAlerts' && 'Get alerts when products are low in stock'}
                  {key === 'paymentReminders' && 'Receive payment due reminders'}
                  {key === 'reportGeneration' && 'Get notified when reports are ready'}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => setNotifications(prev => ({ ...prev, [key]: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
        <Button onClick={handleNotificationUpdate} className="bg-blue-600 hover:bg-blue-700">
          <Save className="h-4 w-4 mr-2" />
          Save Notification Settings
        </Button>
      </CardContent>
    </Card>
  )

  const renderDataManagement = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Data Export & Import</CardTitle>
          <CardDescription>Backup and restore your business data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button onClick={handleExportData} className="bg-green-600 hover:bg-green-700">
              <Download className="h-4 w-4 mr-2" />
              Export All Data
            </Button>
            <Button onClick={handleImportData} variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Import Data
            </Button>
          </div>
          <p className="text-sm text-gray-600">
            Export includes all businesses, transactions, products, vendors, and settings.
          </p>
        </CardContent>
      </Card>

      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600">Danger Zone</CardTitle>
          <CardDescription>Irreversible actions that affect your account</CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={handleDeleteAccount} 
            variant="outline"
            className="border-red-500 text-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Account
          </Button>
          <p className="text-sm text-gray-600 mt-2">
            This will permanently delete your account and all associated data.
          </p>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account and application preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64">
          <Card>
            <CardContent className="p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const IconComponent = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <IconComponent className="h-4 w-4" />
                      <span>{tab.label}</span>
                    </button>
                  )
                })}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === 'profile' && renderProfileSettings()}
          {activeTab === 'business' && renderBusinessSettings()}
          {activeTab === 'notifications' && renderNotificationSettings()}
          {activeTab === 'data' && renderDataManagement()}
          
          {['security', 'system'].includes(activeTab) && (
            <Card>
              <CardContent className="text-center py-12">
                <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Coming Soon</h3>
                <p className="text-gray-600">This settings section is being developed.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
