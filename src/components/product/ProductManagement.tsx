"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Edit, Trash2, Package, AlertTriangle, CheckCircle } from "lucide-react"

interface Product {
  product_id: number
  product_name: string
  description: string
  unit_price: number
  quantity_in_stock: number
  minimum_stock_level: number
  category: string
  created_at: string
}

interface ProductManagementProps {
  user: { username: string; email: string; userid?: string } | null
}

export function ProductManagement({ user }: ProductManagementProps) {
  const [products, setProducts] = useState<Product[]>([
    {
      product_id: 1,
      product_name: "Office Chair",
      description: "Ergonomic office chair with lumbar support",
      unit_price: 85000,
      quantity_in_stock: 15,
      minimum_stock_level: 5,
      category: "Furniture",
      created_at: "2024-01-15"
    },
    {
      product_id: 2,
      product_name: "Laptop Computer",
      description: "Business laptop with 16GB RAM",
      unit_price: 450000,
      quantity_in_stock: 3,
      minimum_stock_level: 5,
      category: "Electronics",
      created_at: "2024-02-20"
    },
    {
      product_id: 3,
      product_name: "Printer Paper",
      description: "A4 white printer paper - 500 sheets",
      unit_price: 2500,
      quantity_in_stock: 50,
      minimum_stock_level: 10,
      category: "Office Supplies",
      created_at: "2024-03-10"
    }
  ])

  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState({
    product_name: "",
    description: "",
    unit_price: "",
    quantity_in_stock: "",
    minimum_stock_level: "",
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

  const getStockStatus = (product: Product) => {
    if (product.quantity_in_stock <= 0) {
      return { status: "out-of-stock", color: "text-red-600", icon: AlertTriangle, text: "Out of Stock" }
    } else if (product.quantity_in_stock <= product.minimum_stock_level) {
      return { status: "low-stock", color: "text-yellow-600", icon: AlertTriangle, text: "Low Stock" }
    } else {
      return { status: "in-stock", color: "text-green-600", icon: CheckCircle, text: "In Stock" }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const productData = {
      ...formData,
      unit_price: parseFloat(formData.unit_price) || 0,
      quantity_in_stock: parseInt(formData.quantity_in_stock) || 0,
      minimum_stock_level: parseInt(formData.minimum_stock_level) || 0
    }

    if (editingProduct) {
      setProducts(products.map(product => 
        product.product_id === editingProduct.product_id 
          ? { ...product, ...productData }
          : product
      ))
    } else {
      const newProduct: Product = {
        product_id: Date.now(),
        ...productData,
        created_at: new Date().toISOString().split('T')[0]
      }
      setProducts([...products, newProduct])
    }

    setFormData({
      product_name: "",
      description: "",
      unit_price: "",
      quantity_in_stock: "",
      minimum_stock_level: "",
      category: ""
    })
    setShowForm(false)
    setEditingProduct(null)
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      product_name: product.product_name,
      description: product.description,
      unit_price: product.unit_price.toString(),
      quantity_in_stock: product.quantity_in_stock.toString(),
      minimum_stock_level: product.minimum_stock_level.toString(),
      category: product.category
    })
    setShowForm(true)
  }

  const handleDelete = (productId: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter(product => product.product_id !== productId))
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const lowStockProducts = products.filter(p => p.quantity_in_stock <= p.minimum_stock_level)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
          <p className="text-gray-600 mt-1">Manage your inventory and product catalog</p>
        </div>
        <Button 
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <CardTitle className="text-yellow-800">Low Stock Alert</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-yellow-700 mb-2">
              {lowStockProducts.length} product(s) are running low on stock:
            </p>
            <div className="space-y-1">
              {lowStockProducts.map(product => (
                <div key={product.product_id} className="text-sm text-yellow-700">
                  • {product.product_name} ({product.quantity_in_stock} remaining)
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingProduct ? "Edit Product" : "Add New Product"}</CardTitle>
            <CardDescription>
              {editingProduct ? "Update product information" : "Enter product details to add to inventory"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="product_name">Product Name *</Label>
                  <Input
                    id="product_name"
                    name="product_name"
                    value={formData.product_name}
                    onChange={handleChange}
                    placeholder="Enter product name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="Enter product category"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter product description"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit_price">Unit Price (FCFA) *</Label>
                  <Input
                    id="unit_price"
                    name="unit_price"
                    type="number"
                    value={formData.unit_price}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity_in_stock">Quantity in Stock *</Label>
                  <Input
                    id="quantity_in_stock"
                    name="quantity_in_stock"
                    type="number"
                    value={formData.quantity_in_stock}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minimum_stock_level">Minimum Stock Level</Label>
                  <Input
                    id="minimum_stock_level"
                    name="minimum_stock_level"
                    type="number"
                    value={formData.minimum_stock_level}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>
              <div className="flex space-x-2">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  {editingProduct ? "Update Product" : "Add Product"}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setShowForm(false)
                    setEditingProduct(null)
                    setFormData({
                      product_name: "",
                      description: "",
                      unit_price: "",
                      quantity_in_stock: "",
                      minimum_stock_level: "",
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

      {/* Product List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => {
          const stockStatus = getStockStatus(product)
          const StatusIcon = stockStatus.icon
          
          return (
            <Card key={product.product_id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Package className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-lg">{product.product_name}</CardTitle>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(product)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(product.product_id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {product.description && (
                  <p className="text-sm text-gray-600">{product.description}</p>
                )}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Price:</span>
                    <span className="text-lg font-bold text-blue-600">
                      {formatCurrency(product.unit_price)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Stock:</span>
                    <div className="flex items-center space-x-1">
                      <StatusIcon className={`h-4 w-4 ${stockStatus.color}`} />
                      <span className={`text-sm font-medium ${stockStatus.color}`}>
                        {product.quantity_in_stock} units
                      </span>
                    </div>
                  </div>
                  {product.category && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Category:</span>
                      <span className="text-sm text-gray-600">{product.category}</span>
                    </div>
                  )}
                </div>
                <div className="text-xs text-gray-500 pt-2 border-t">
                  Added: {new Date(product.created_at).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {products.length === 0 && !showForm && (
        <Card>
          <CardContent className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-4">Get started by adding your first product</p>
            <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Product
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
