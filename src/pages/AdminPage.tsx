import React, { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { Plus, Edit, Trash2, Package, Tag, Settings, Users, ShoppingBag, Eye, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

interface Category {
  id: string
  name: string
  description: string
}

interface Product {
  id: string
  name: string
  description: string
  price: number
  category_id: string
  sizes: string[]
  categories?: { name: string }
}

interface DiscountCode {
  id: string
  code: string
  discount_percentage: number
  active: boolean
}

interface Order {
  id: string
  order_number: string
  status: string
  total_amount: number
  discount_amount: number
  discount_code: string | null
  customer_email: string
  customer_mobile: string
  customer_alternate_mobile: string | null
  shipping_country: string
  shipping_state: string
  shipping_city: string
  shipping_pin_code: string
  created_at: string
  order_items: {
    product_name: string
    size: string
    quantity: number
    item_total: number
  }[]
}

const SPECIAL_DISCOUNT_SETTINGS_ID = '00000000-0000-0000-0000-000000000001'

const statusOptions = [
  { value: 'pending', label: 'Yet to Dispatch', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'processing', label: 'Processing', color: 'bg-blue-100 text-blue-800' },
  { value: 'shipped', label: 'On the Way', color: 'bg-purple-100 text-purple-800' },
  { value: 'delivered', label: 'Delivered', color: 'bg-green-100 text-green-800' },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' }
]

export default function AdminPage() {
  const { user, isAdmin } = useAuth()
  const [activeTab, setActiveTab] = useState('orders')
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [discountCodes, setDiscountCodes] = useState<DiscountCode[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [specialDiscountActive, setSpecialDiscountActive] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showOrderModal, setShowOrderModal] = useState(false)
  
  // Form states
  const [showCategoryForm, setShowCategoryForm] = useState(false)
  const [showProductForm, setShowProductForm] = useState(false)
  const [showDiscountForm, setShowDiscountForm] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)

  const [categoryForm, setCategoryForm] = useState({ name: '', description: '' })
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: 0,
    category_id: '',
    sizes: [''],
    image_urls: ['']
  })
  const [discountForm, setDiscountForm] = useState({
    code: '',
    discount_percentage: 0,
    active: true
  })

  useEffect(() => {
    if (user && isAdmin) {
      loadData()
    }
  }, [user, isAdmin])

  if (!user || !isAdmin) {
    return (
      <Navigate to="/" replace />
    )
  }

  const loadData = async () => {
    await Promise.all([
      loadCategories(),
      loadProducts(),
      loadDiscountCodes(),
      loadOrders(),
      loadSpecialDiscountSettings()
    ])
  }

  const loadCategories = async () => {
    const { data } = await supabase.from('categories').select('*')
    setCategories(data || [])
  }

  const loadProducts = async () => {
    const { data } = await supabase
      .from('products')
      .select('*, categories(name)')
    setProducts(data || [])
  }

  const loadDiscountCodes = async () => {
    const { data } = await supabase.from('discount_codes').select('*')
    setDiscountCodes(data || [])
  }

  const loadOrders = async () => {
    try {
      // First, fetch orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })

      if (ordersError) {
        console.error('Error loading orders:', ordersError)
        return
      }

      if (!ordersData || ordersData.length === 0) {
        setOrders([])
        return
      }

      // Get all order IDs
      const orderIds = ordersData.map(order => order.id)

      // Fetch order items for all orders
      const { data: orderItemsData, error: itemsError } = await supabase
        .from('order_items')
        .select('*')
        .in('order_id', orderIds)

      if (itemsError) {
        console.error('Error loading order items:', itemsError)
        return
      }

      // Merge order items with orders
      const ordersWithItems = ordersData.map(order => ({
        ...order,
        order_items: (orderItemsData || []).filter(item => item.order_id === order.id)
      }))

      setOrders(ordersWithItems)
    } catch (error) {
      console.error('Error loading orders:', error)
    }
  }

  const loadSpecialDiscountSettings = async () => {
    const { data } = await supabase
      .from('special_discount_settings')
      .select('active')
      .eq('id', SPECIAL_DISCOUNT_SETTINGS_ID)
      .maybeSingle()
    setSpecialDiscountActive(data?.active || false)
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId)

    if (!error) {
      loadOrders()
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null)
      }
    }
  }

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingItem) {
      await supabase
        .from('categories')
        .update(categoryForm)
        .eq('id', editingItem.id)
    } else {
      await supabase.from('categories').insert(categoryForm)
    }
    
    setCategoryForm({ name: '', description: '' })
    setShowCategoryForm(false)
    setEditingItem(null)
    loadCategories()
  }

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const productData = {
      name: productForm.name,
      description: productForm.description,
      price: productForm.price,
      category_id: productForm.category_id,
      sizes: productForm.sizes.filter(size => size.trim() !== '')
    }

    let productId = editingItem?.id

    if (editingItem) {
      await supabase
        .from('products')
        .update(productData)
        .eq('id', editingItem.id)
    } else {
      const { data } = await supabase
        .from('products')
        .insert(productData)
        .select('id')
        .single()
      productId = data?.id
    }

    if (productId) {
      if (editingItem) {
        await supabase
          .from('product_images')
          .delete()
          .eq('product_id', productId)
      }

      const imageInserts = productForm.image_urls
        .filter(url => url.trim() !== '')
        .map((url, index) => ({
          product_id: productId,
          image_url: url,
          order_index: index,
          alt_text: productForm.name
        }))

      if (imageInserts.length > 0) {
        await supabase.from('product_images').insert(imageInserts)
      }
    }
    
    setProductForm({
      name: '',
      description: '',
      price: 0,
      category_id: '',
      sizes: [''],
      image_urls: ['']
    })
    setShowProductForm(false)
    setEditingItem(null)
    loadProducts()
  }

  const handleDiscountSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const discountData = {
      ...discountForm,
      code: discountForm.code.toUpperCase()
    }

    if (editingItem) {
      await supabase
        .from('discount_codes')
        .update(discountData)
        .eq('id', editingItem.id)
    } else {
      await supabase.from('discount_codes').insert(discountData)
    }
    
    setDiscountForm({ code: '', discount_percentage: 0, active: true })
    setShowDiscountForm(false)
    setEditingItem(null)
    loadDiscountCodes()
  }

  const handleDelete = async (table: string, id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      await supabase.from(table).delete().eq('id', id)
      loadData()
    }
  }

  const toggleSpecialDiscount = async () => {
    const newState = !specialDiscountActive
    
    await supabase
      .from('special_discount_settings')
      .upsert({ id: SPECIAL_DISCOUNT_SETTINGS_ID, active: newState })
    
    setSpecialDiscountActive(newState)
  }

  const startEdit = (item: any, type: string) => {
    setEditingItem(item)
    
    if (type === 'category') {
      setCategoryForm({ name: item.name, description: item.description })
      setShowCategoryForm(true)
    } else if (type === 'product') {
      setProductForm({
        name: item.name,
        description: item.description,
        price: item.price,
        category_id: item.category_id,
        sizes: item.sizes.length ? item.sizes : [''],
        image_urls: ['']
      })
      setShowProductForm(true)
    } else if (type === 'discount') {
      setDiscountForm({
        code: item.code,
        discount_percentage: item.discount_percentage,
        active: item.active
      })
      setShowDiscountForm(true)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status: string) => {
    return statusOptions.find(option => option.value === status)?.color || 'bg-gray-100 text-gray-800'
  }

  const getStatusLabel = (status: string) => {
    return statusOptions.find(option => option.value === status)?.label || status
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-navy-900">Admin Dashboard</h1>
          <p className="font-body text-gray-600 mt-2">Manage your SKATIOUS store</p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'orders', name: 'Orders', icon: ShoppingBag },
                { id: 'products', name: 'Products', icon: Package },
                { id: 'categories', name: 'Categories', icon: Tag },
                { id: 'discounts', name: 'Discounts', icon: Settings },
              ].map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-heading font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-emerald-500 text-emerald-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.name}</span>
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="font-heading text-xl font-semibold text-gray-900">Orders Management</h2>
              <div className="text-sm text-gray-600 font-body">
                {orders.length} total orders
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900 font-heading">#{order.order_number}</div>
                          <div className="text-sm text-gray-500 font-body">{order.order_items.length} items</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900 font-body">{order.customer_email}</div>
                          <div className="text-sm text-gray-500 font-body">{order.customer_mobile}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                            className={`text-sm font-medium rounded-full px-3 py-1 border-0 ${getStatusColor(order.status)}`}
                          >
                            {statusOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900 font-body">${order.total_amount.toFixed(2)}</div>
                          {order.discount_amount > 0 && (
                            <div className="text-sm text-green-600 font-body">
                              -${order.discount_amount.toFixed(2)}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-body">
                          {formatDate(order.created_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => {
                              setSelectedOrder(order)
                              setShowOrderModal(true)
                            }}
                            className="text-emerald-600 hover:text-emerald-900 flex items-center space-x-1"
                          >
                            <Eye className="h-4 w-4" />
                            <span>View</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="font-heading text-xl font-semibold text-gray-900">Products</h2>
              <button
                onClick={() => setShowProductForm(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-heading font-medium flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Product</span>
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sizes
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900 font-heading">{product.name}</div>
                        <div className="text-sm text-gray-500 font-body">{product.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-body">
                        {product.categories?.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-body">
                        ${product.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-body">
                        {product.sizes.join(', ')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => startEdit(product, 'product')}
                            className="text-emerald-600 hover:text-emerald-900"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete('products', product.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="font-heading text-xl font-semibold text-gray-900">Categories</h2>
              <button
                onClick={() => setShowCategoryForm(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-heading font-medium flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Category</span>
              </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <div key={category.id} className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-heading text-lg font-semibold text-gray-900">
                      {category.name}
                    </h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => startEdit(category, 'category')}
                        className="text-emerald-600 hover:text-emerald-900"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete('categories', category.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <p className="font-body text-gray-600">{category.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Discounts Tab */}
        {activeTab === 'discounts' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="font-heading text-xl font-semibold text-gray-900">Discount Management</h2>
              <button
                onClick={() => setShowDiscountForm(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-heading font-medium flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Discount Code</span>
              </button>
            </div>

            {/* Special Discount Toggle */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-heading text-lg font-semibold text-gray-900">Special Dice Discount</h3>
                  <p className="font-body text-gray-600">Allow users to roll dice for random discounts</p>
                </div>
                <button
                  onClick={toggleSpecialDiscount}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
                    specialDiscountActive ? 'bg-emerald-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      specialDiscountActive ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Discount Codes */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Discount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {discountCodes.map((discount) => (
                    <tr key={discount.id}>
                      <td className="px-6 py-4 whitespace-nowrap font-mono text-sm font-medium text-gray-900">
                        {discount.code}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-body">
                        {discount.discount_percentage}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          discount.active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {discount.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => startEdit(discount, 'discount')}
                            className="text-emerald-600 hover:text-emerald-900"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete('discount_codes', discount.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Order Details Modal */}
        {showOrderModal && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="font-heading text-xl font-semibold text-gray-900">
                    Order Details - #{selectedOrder.order_number}
                  </h3>
                  <button
                    onClick={() => setShowOrderModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Order Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 font-heading mb-2">
                    Order Status
                  </label>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 font-body"
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Customer Information */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-heading text-lg font-semibold text-gray-900 mb-3">Customer Information</h4>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">Email:</span> {selectedOrder.customer_email}</div>
                      <div><span className="font-medium">Mobile:</span> {selectedOrder.customer_mobile}</div>
                      {selectedOrder.customer_alternate_mobile && (
                        <div><span className="font-medium">Alt Mobile:</span> {selectedOrder.customer_alternate_mobile}</div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-heading text-lg font-semibold text-gray-900 mb-3">Shipping Address</h4>
                    <div className="space-y-1 text-sm">
                      <div>{selectedOrder.shipping_city}, {selectedOrder.shipping_state}</div>
                      <div>{selectedOrder.shipping_country}</div>
                      <div>PIN: {selectedOrder.shipping_pin_code}</div>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h4 className="font-heading text-lg font-semibold text-gray-900 mb-3">Order Items</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    {selectedOrder.order_items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                        <span className="font-body text-gray-700">
                          {item.product_name} ({item.size}) × {item.quantity}
                        </span>
                        <span className="font-semibold">${item.item_total.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-heading text-lg font-semibold text-gray-900 mb-3">Order Summary</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>${(selectedOrder.total_amount + selectedOrder.discount_amount).toFixed(2)}</span>
                    </div>
                    {selectedOrder.discount_amount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>
                          Discount {selectedOrder.discount_code && `(${selectedOrder.discount_code})`}:
                        </span>
                        <span>-${selectedOrder.discount_amount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-semibold text-lg border-t border-gray-300 pt-2">
                      <span>Total:</span>
                      <span>${selectedOrder.total_amount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Category Form Modal */}
        {showCategoryForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
              <h3 className="font-heading text-lg font-semibold text-gray-900 mb-4">
                {editingItem ? 'Edit Category' : 'Add Category'}
              </h3>
              <form onSubmit={handleCategorySubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 font-heading mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 font-body"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 font-heading mb-1">
                    Description
                  </label>
                  <textarea
                    value={categoryForm.description}
                    onChange={(e) => setCategoryForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 font-body"
                    rows={3}
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-lg font-heading font-medium"
                  >
                    {editingItem ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCategoryForm(false)
                      setEditingItem(null)
                      setCategoryForm({ name: '', description: '' })
                    }}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg font-heading font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Product Form Modal */}
        {showProductForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
            <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 my-8">
              <h3 className="font-heading text-lg font-semibold text-gray-900 mb-4">
                {editingItem ? 'Edit Product' : 'Add Product'}
              </h3>
              <form onSubmit={handleProductSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 font-heading mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 font-body"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 font-heading mb-1">
                    Description
                  </label>
                  <textarea
                    required
                    value={productForm.description}
                    onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 font-body"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 font-heading mb-1">
                      Price
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={productForm.price}
                      onChange={(e) => setProductForm(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 font-body"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 font-heading mb-1">
                      Category
                    </label>
                    <select
                      required
                      value={productForm.category_id}
                      onChange={(e) => setProductForm(prev => ({ ...prev, category_id: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 font-body"
                    >
                      <option value="">Select Category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 font-heading mb-1">
                    Sizes
                  </label>
                  {productForm.sizes.map((size, index) => (
                    <div key={index} className="flex space-x-2 mb-2">
                      <input
                        type="text"
                        value={size}
                        onChange={(e) => {
                          const newSizes = [...productForm.sizes]
                          newSizes[index] = e.target.value
                          setProductForm(prev => ({ ...prev, sizes: newSizes }))
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 font-body"
                        placeholder="e.g., Small, Medium, Large"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newSizes = productForm.sizes.filter((_, i) => i !== index)
                          setProductForm(prev => ({ ...prev, sizes: newSizes }))
                        }}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setProductForm(prev => ({ ...prev, sizes: [...prev.sizes, ''] }))}
                    className="text-emerald-600 hover:text-emerald-800 text-sm font-heading"
                  >
                    + Add Size
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 font-heading mb-1">
                    Image URLs
                  </label>
                  {productForm.image_urls.map((url, index) => (
                    <div key={index} className="flex space-x-2 mb-2">
                      <input
                        type="url"
                        value={url}
                        onChange={(e) => {
                          const newUrls = [...productForm.image_urls]
                          newUrls[index] = e.target.value
                          setProductForm(prev => ({ ...prev, image_urls: newUrls }))
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 font-body"
                        placeholder="https://example.com/image.jpg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newUrls = productForm.image_urls.filter((_, i) => i !== index)
                          setProductForm(prev => ({ ...prev, image_urls: newUrls }))
                        }}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setProductForm(prev => ({ ...prev, image_urls: [...prev.image_urls, ''] }))}
                    className="text-emerald-600 hover:text-emerald-800 text-sm font-heading"
                  >
                    + Add Image
                  </button>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-lg font-heading font-medium"
                  >
                    {editingItem ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowProductForm(false)
                      setEditingItem(null)
                      setProductForm({
                        name: '',
                        description: '',
                        price: 0,
                        category_id: '',
                        sizes: [''],
                        image_urls: ['']
                      })
                    }}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg font-heading font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Discount Form Modal */}
        {showDiscountForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
              <h3 className="font-heading text-lg font-semibold text-gray-900 mb-4">
                {editingItem ? 'Edit Discount Code' : 'Add Discount Code'}
              </h3>
              <form onSubmit={handleDiscountSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 font-heading mb-1">
                    Code
                  </label>
                  <input
                    type="text"
                    required
                    value={discountForm.code}
                    onChange={(e) => setDiscountForm(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 font-mono font-body"
                    placeholder="SAVE20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 font-heading mb-1">
                    Discount Percentage
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    required
                    value={discountForm.discount_percentage}
                    onChange={(e) => setDiscountForm(prev => ({ ...prev, discount_percentage: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 font-body"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="active"
                    checked={discountForm.active}
                    onChange={(e) => setDiscountForm(prev => ({ ...prev, active: e.target.checked }))}
                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                  />
                  <label htmlFor="active" className="ml-2 block text-sm text-gray-900 font-heading">
                    Active
                  </label>
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-lg font-heading font-medium"
                  >
                    {editingItem ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowDiscountForm(false)
                      setEditingItem(null)
                      setDiscountForm({ code: '', discount_percentage: 0, active: true })
                    }}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg font-heading font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}