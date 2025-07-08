import React, { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { User, Package, Edit, Save, X, MapPin, Phone, Mail, Calendar } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

interface Profile {
  full_name: string
  email: string
  mobile_number: string
  alternate_mobile: string
  country: string
  state: string
  city: string
  pin_code: string
  full_address: string
}

interface Order {
  id: string
  order_number: string
  status: string
  total_amount: number
  discount_amount: number
  discount_code: string | null
  created_at: string
  order_items: {
    product_name: string
    product_description: string | null
    product_image_url: string | null
    size: string
    quantity: number
    item_total: number
  }[]
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'
}

const statusLabels = {
  pending: 'Yet to Dispatch',
  processing: 'Processing',
  shipped: 'On the Way',
  delivered: 'Delivered',
  cancelled: 'Cancelled'
}

export default function ProfilePage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [profile, setProfile] = useState<Profile>({
    full_name: '',
    email: '',
    mobile_number: '',
    alternate_mobile: '',
    country: '',
    state: '',
    city: '',
    pin_code: '',
    full_address: ''
  })
  const [orders, setOrders] = useState<Order[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (user) {
      loadProfile()
      loadOrders()
    }
  }, [user])

  // Check URL params for tab
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const tab = urlParams.get('tab')
    if (tab === 'orders') {
      setActiveTab('orders')
    }
  }, [])

  if (!user) {
    return <Navigate to="/auth" replace />
  }

  const loadProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle()

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading profile:', error)
        return
      }

      if (data) {
        setProfile({
          full_name: data.full_name || '',
          email: data.email || user.email || '',
          mobile_number: data.mobile_number || '',
          alternate_mobile: data.alternate_mobile || '',
          country: data.country || '',
          state: data.state || '',
          city: data.city || '',
          pin_code: data.pin_code || '',
          full_address: data.full_address || ''
        })
      } else {
        // No profile exists, use user email
        setProfile(prev => ({
          ...prev,
          email: user.email || ''
        }))
      }
    } catch (error) {
      console.error('Error loading profile:', error)
    }
  }

  const loadOrders = async () => {
    try {
      // First, fetch orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
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
        .select('order_id, product_name, product_description, product_image_url, size, quantity, item_total')
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
    } finally {
      setLoading(false)
    }
  }

  const saveProfile = async () => {
    setSaving(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: profile.full_name,
          email: profile.email,
          mobile_number: profile.mobile_number,
          alternate_mobile: profile.alternate_mobile,
          country: profile.country,
          state: profile.state,
          city: profile.city,
          pin_code: profile.pin_code,
          full_address: profile.full_address
        })

      if (error) {
        console.error('Error saving profile:', error)
        alert('Error saving profile. Please try again.')
        return
      }

      setIsEditing(false)
      alert('Profile updated successfully!')
    } catch (error) {
      console.error('Error saving profile:', error)
      alert('Error saving profile. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfile(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-navy-900">My Account</h1>
          <p className="font-body text-gray-600 mt-2">
            Welcome back, {profile.full_name || 'User'}! Manage your profile and view your orders
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-heading font-medium text-sm ${
                  activeTab === 'profile'
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <User className="h-4 w-4" />
                <span>Profile</span>
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-heading font-medium text-sm ${
                  activeTab === 'orders'
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Package className="h-4 w-4" />
                <span>My Orders</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-heading text-xl font-semibold text-gray-900">Personal Information</h2>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-heading font-medium transition-colors"
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={saveProfile}
                    disabled={saving}
                    className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white px-4 py-2 rounded-lg font-heading font-medium transition-colors"
                  >
                    <Save className="h-4 w-4" />
                    <span>{saving ? 'Saving...' : 'Save'}</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false)
                      loadProfile() // Reset changes
                    }}
                    className="flex items-center space-x-2 bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg font-heading font-medium transition-colors"
                  >
                    <X className="h-4 w-4" />
                    <span>Cancel</span>
                  </button>
                </div>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 font-heading mb-1">
                  <User className="h-4 w-4 inline mr-1" />
                  Full Name
                </label>
                <input
                  type="text"
                  name="full_name"
                  value={profile.full_name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 font-body disabled:bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 font-heading mb-1">
                  <Mail className="h-4 w-4 inline mr-1" />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 font-body disabled:bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 font-heading mb-1">
                  <Phone className="h-4 w-4 inline mr-1" />
                  Mobile Number
                </label>
                <input
                  type="tel"
                  name="mobile_number"
                  value={profile.mobile_number}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 font-body disabled:bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 font-heading mb-1">
                  Alternate Mobile
                </label>
                <input
                  type="tel"
                  name="alternate_mobile"
                  value={profile.alternate_mobile}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 font-body disabled:bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 font-heading mb-1">
                  <MapPin className="h-4 w-4 inline mr-1" />
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  value={profile.country}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 font-body disabled:bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 font-heading mb-1">
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  value={profile.state}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 font-body disabled:bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 font-heading mb-1">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={profile.city}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 font-body disabled:bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 font-heading mb-1">
                  PIN Code
                </label>
                <input
                  type="text"
                  name="pin_code"
                  value={profile.pin_code}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 font-body disabled:bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 font-heading mb-1">
                  Full Address
                </label>
                <textarea
                  name="full_address"
                  value={profile.full_address}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 font-body disabled:bg-gray-50"
                  rows={3}
                />
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {loading ? (
              <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
                <p className="font-body text-gray-600 mt-4">Loading your orders...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="font-heading text-xl font-semibold text-gray-900 mb-2">No orders yet</h3>
                <p className="font-body text-gray-600 mb-6">You haven't placed any orders yet. Start shopping to see your orders here!</p>
                <a
                  href="/products"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-heading font-semibold transition-colors duration-200 inline-block"
                >
                  Shop Now
                </a>
              </div>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                    <div className="flex items-center space-x-4 mb-4 lg:mb-0">
                      <div>
                        <h3 className="font-heading text-lg font-semibold text-gray-900">
                          Order #{order.order_number}
                        </h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span className="font-body">{formatDate(order.created_at)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status as keyof typeof statusColors]}`}>
                        {statusLabels[order.status as keyof typeof statusLabels]}
                      </span>
                      <div className="text-right">
                        <div className="font-heading text-lg font-semibold text-gray-900">
                          ₹{order.total_amount.toFixed(2)}
                        </div>
                        {order.discount_amount > 0 && (
                          <div className="text-sm text-green-600 font-body">
                            Saved ₹{order.discount_amount.toFixed(2)}
                            {order.discount_code && ` (${order.discount_code})`}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="font-heading font-medium text-gray-900 mb-3">Order Items</h4>
                    <div className="space-y-2">
                      {order.order_items.map((item, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          {item.product_image_url && (
                            <img
                              src={item.product_image_url}
                              alt={item.product_name}
                              className="w-12 h-12 object-cover rounded-md"
                            />
                          )}
                          <div className="flex-1">
                            <div className="font-body font-medium text-gray-900">
                              {item.product_name}
                            </div>
                            <div className="text-sm text-gray-600">
                              Size: {item.size} • Quantity: {item.quantity}
                            </div>
                            {item.product_description && (
                              <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                                {item.product_description}
                              </div>
                            )}
                          </div>
                          <div className="text-right">
                            <span className="font-semibold text-gray-900">₹{item.item_total.toFixed(2)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}