"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Edit, Trash2, UserCheck, Phone, Mail, MapPin, CreditCard } from "lucide-react"

interface Vendor {
  vendor_id: number
  vendor_name: string
  contact_person: string
  phone: string
  email: string
  address: string
  payment_terms: string
  created_at: string
}

interface VendorManagementProps {
  user: { username: string; email: string; userid?: string } | null
}

export function VendorManagement({ user }: VendorManagementProps) {
  const [vendors, setVendors] = useState<Vendor[]>([
    {
      vendor_id: 1,
      vendor_name: "Office Supplies Co.",
      contact_person: "Jean Dupont",
      phone: "+237 6XX XXX XXX",
      email: "jean@officesupplies.cm",
      address: "Douala, Cameroon",
      payment_terms: "Net 30",
      created_at: "2024-01-15"
    },
    {
      vendor_id: 2,
      vendor_name: "Tech Equipment Ltd",
      contact_person: "Marie Ngono",
      phone: "+237 6XX XXX XXX",
      email: "marie@techequipment.cm",
      address: "Yaoundé, Cameroon",
      payment_terms: "Net 15",
      created_at: "2024-02-20"
    }
  ])

  const [showForm, setShowForm] = useState(false)
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null)
  const [formData, setFormData] = useState({
    vendor_name: "",
    contact_person: "",
    phone: "",
    email: "",
    address: "",
    payment_terms: ""
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingVendor) {
      setVendors(vendors.map(vendor => 
        vendor.vendor_id === editingVendor.vendor_id 
          ? { ...vendor, ...formData }
          : vendor
      ))
    } else {
      const newVendor: Vendor = {
        vendor_id: Date.now(),
        ...formData,
        created_at: new Date().toISOString().split('T')[0]
      }
      setVendors([...vendors, newVendor])
    }

    setFormData({
      vendor_name: "",
      contact_person: "",
      phone: "",
      email: "",
      address: "",
      payment_terms: ""
    })
    setShowForm(false)
    setEditingVendor(null)
  }

  const handleEdit = (vendor: Vendor) => {
    setEditingVendor(vendor)
    setFormData({
      vendor_name: vendor.vendor_name,
      contact_person: vendor.contact_person,
      phone: vendor.phone,
      email: vendor.email,
      address: vendor.address,
      payment_terms: vendor.payment_terms
    })
    setShowForm(true)
  }

  const handleDelete = (vendorId: number) => {
    if (confirm("Are you sure you want to delete this vendor?")) {
      setVendors(vendors.filter(vendor => vendor.vendor_id !== vendorId))
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
          <h1 className="text-3xl font-bold text-gray-900">Vendor Management</h1>
          <p className="text-gray-600 mt-1">Manage your suppliers and service providers</p>
        </div>
        <Button 
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Vendor
        </Button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingVendor ? "Edit Vendor" : "Add New Vendor"}</CardTitle>
            <CardDescription>
              {editingVendor ? "Update vendor information" : "Enter vendor details to add a new supplier"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vendor_name">Vendor Name *</Label>
                  <Input
                    id="vendor_name"
                    name="vendor_name"
                    value={formData.vendor_name}
                    onChange={handleChange}
                    placeholder="Enter vendor name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact_person">Contact Person</Label>
                  <Input
                    id="contact_person"
                    name="contact_person"
                    value={formData.contact_person}
                    onChange={handleChange}
                    placeholder="Enter contact person name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+237 6XX XXX XXX"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="vendor@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="payment_terms">Payment Terms</Label>
                  <Input
                    id="payment_terms"
                    name="payment_terms"
                    value={formData.payment_terms}
                    onChange={handleChange}
                    placeholder="e.g., Net 30, Net 15, COD"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter vendor address"
                  />
                </div>
              </div>
              <div className="flex space-x-2">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  {editingVendor ? "Update Vendor" : "Add Vendor"}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setShowForm(false)
                    setEditingVendor(null)
                    setFormData({
                      vendor_name: "",
                      contact_person: "",
                      phone: "",
                      email: "",
                      address: "",
                      payment_terms: ""
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

      {/* Vendor List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vendors.map((vendor) => (
          <Card key={vendor.vendor_id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <UserCheck className="h-5 w-5 text-green-600" />
                  <CardTitle className="text-lg">{vendor.vendor_name}</CardTitle>
                </div>
                <div className="flex space-x-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(vendor)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(vendor.vendor_id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {vendor.contact_person && (
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Contact:</span> {vendor.contact_person}
                </div>
              )}
              {vendor.phone && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Phone className="h-4 w-4" />
                  <span>{vendor.phone}</span>
                </div>
              )}
              {vendor.email && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span>{vendor.email}</span>
                </div>
              )}
              {vendor.address && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{vendor.address}</span>
                </div>
              )}
              {vendor.payment_terms && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <CreditCard className="h-4 w-4" />
                  <span>{vendor.payment_terms}</span>
                </div>
              )}
              <div className="text-xs text-gray-500 pt-2 border-t">
                Added: {new Date(vendor.created_at).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {vendors.length === 0 && !showForm && (
        <Card>
          <CardContent className="text-center py-12">
            <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No vendors found</h3>
            <p className="text-gray-600 mb-4">Get started by adding your first vendor</p>
            <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Vendor
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
