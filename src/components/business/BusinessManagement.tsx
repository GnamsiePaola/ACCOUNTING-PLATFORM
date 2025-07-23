"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Edit, Trash2, Building2, Phone, Mail, MapPin } from "lucide-react"

interface Business {
  business_id: number
  business_name: string
  contact_phone: string
  contact_email: string
  address: string
  tax_id: string
  created_at: string
}

interface BusinessManagementProps {
  user: { username: string; email: string; userid?: string } | null
}

export function BusinessManagement({ user }: BusinessManagementProps) {
  const [businesses, setBusinesses] = useState<Business[]>([
    {
      business_id: 1,
      business_name: "Tech Solutions SARL",
      contact_phone: "+237 6XX XXX XXX",
      contact_email: "contact@techsolutions.cm",
      address: "Douala, Cameroon",
      tax_id: "CM123456789",
      created_at: "2024-01-15"
    },
    {
      business_id: 2,
      business_name: "Commerce Plus",
      contact_phone: "+237 6XX XXX XXX",
      contact_email: "info@commerceplus.cm",
      address: "Yaoundé, Cameroon",
      tax_id: "CM987654321",
      created_at: "2024-02-20"
    }
  ])

  const [showForm, setShowForm] = useState(false)
  const [editingBusiness, setEditingBusiness] = useState<Business | null>(null)
  const [formData, setFormData] = useState({
    business_name: "",
    contact_phone: "",
    contact_email: "",
    address: "",
    tax_id: ""
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingBusiness) {
      // Update existing business
      setBusinesses(businesses.map(business => 
        business.business_id === editingBusiness.business_id 
          ? { ...business, ...formData }
          : business
      ))
    } else {
      // Add new business
      const newBusiness: Business = {
        business_id: Date.now(),
        ...formData,
        created_at: new Date().toISOString().split('T')[0]
      }
      setBusinesses([...businesses, newBusiness])
    }

    // Reset form
    setFormData({
      business_name: "",
      contact_phone: "",
      contact_email: "",
      address: "",
      tax_id: ""
    })
    setShowForm(false)
    setEditingBusiness(null)
  }

  const handleEdit = (business: Business) => {
    setEditingBusiness(business)
    setFormData({
      business_name: business.business_name,
      contact_phone: business.contact_phone,
      contact_email: business.contact_email,
      address: business.address,
      tax_id: business.tax_id
    })
    setShowForm(true)
  }

  const handleDelete = (businessId: number) => {
    if (confirm("Are you sure you want to delete this business?")) {
      setBusinesses(businesses.filter(business => business.business_id !== businessId))
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
          <h1 className="text-3xl font-bold text-gray-900">Business Management</h1>
          <p className="text-gray-600 mt-1">Manage your business information and details</p>
        </div>
        <Button 
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Business
        </Button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingBusiness ? "Edit Business" : "Add New Business"}</CardTitle>
            <CardDescription>
              {editingBusiness ? "Update business information" : "Enter business details to add a new business"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="business_name">Business Name *</Label>
                  <Input
                    id="business_name"
                    name="business_name"
                    value={formData.business_name}
                    onChange={handleChange}
                    placeholder="Enter business name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tax_id">Tax ID</Label>
                  <Input
                    id="tax_id"
                    name="tax_id"
                    value={formData.tax_id}
                    onChange={handleChange}
                    placeholder="Enter tax identification number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact_phone">Phone Number</Label>
                  <Input
                    id="contact_phone"
                    name="contact_phone"
                    value={formData.contact_phone}
                    onChange={handleChange}
                    placeholder="+237 6XX XXX XXX"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact_email">Email Address</Label>
                  <Input
                    id="contact_email"
                    name="contact_email"
                    type="email"
                    value={formData.contact_email}
                    onChange={handleChange}
                    placeholder="business@example.com"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter business address"
                  />
                </div>
              </div>
              <div className="flex space-x-2">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  {editingBusiness ? "Update Business" : "Add Business"}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setShowForm(false)
                    setEditingBusiness(null)
                    setFormData({
                      business_name: "",
                      contact_phone: "",
                      contact_email: "",
                      address: "",
                      tax_id: ""
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

      {/* Business List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {businesses.map((business) => (
          <Card key={business.business_id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Building2 className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-lg">{business.business_name}</CardTitle>
                </div>
                <div className="flex space-x-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(business)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(business.business_id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {business.contact_phone && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Phone className="h-4 w-4" />
                  <span>{business.contact_phone}</span>
                </div>
              )}
              {business.contact_email && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span>{business.contact_email}</span>
                </div>
              )}
              {business.address && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{business.address}</span>
                </div>
              )}
              {business.tax_id && (
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Tax ID:</span> {business.tax_id}
                </div>
              )}
              <div className="text-xs text-gray-500 pt-2 border-t">
                Created: {new Date(business.created_at).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {businesses.length === 0 && !showForm && (
        <Card>
          <CardContent className="text-center py-12">
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No businesses found</h3>
            <p className="text-gray-600 mb-4">Get started by adding your first business</p>
            <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Business
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
