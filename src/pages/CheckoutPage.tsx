import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

interface ShippingInfo {
  email: string
  mobile_number: string
  alternate_mobile: string
  country: string
  state: string
  city: string
  pin_code: string
}

export default function CheckoutPage() {
  const { items, getCartTotal, clearCart, discountCode, discountPercentage, getFinalTotal } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    email: '',
    mobile_number: '',
    alternate_mobile: '',
    country: '',
    state: '',
    city: '',
    pin_code: '',
  })
  
  const [codeDiscountPercentage, setCodeDiscountPercentage] = useState(0)
  const [promoCode, setPromoCode] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart')
      return
    }

    loadUserInfo()
  }, [user, items])

  const loadUserInfo = async () => {
    if (user) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle()
        
        if (error) {
          console.error('Error loading profile:', error)
          setShippingInfo(prev => ({
            ...prev,
            email: user.email || ''
          }))
          return
        }

        if (data) {
          setShippingInfo({
            email: data.email || user.email || '',
            mobile_number: data.mobile_number || '',
            alternate_mobile: data.alternate_mobile || '',
            country: data.country || '',
            state: data.state || '',
            city: data.city || '',
            pin_code: data.pin_code || '',
          })
        } else {
          setShippingInfo(prev => ({
            ...prev,
            email: user.email || ''
          }))
        }
      } catch (error) {
        console.error('Error loading user info:', error)
        setShippingInfo(prev => ({
          ...prev,
          email: user.email || ''
        }))
      }
    }
  }

  const validateDiscountCode = async () => {
    if (!promoCode.trim()) return

    try {
      const { data } = await supabase
        .from('discount_codes')
        .select('discount_percentage')
        .eq('code', promoCode.toUpperCase())
        .eq('active', true)
        .single()
      
      if (data) {
        setCodeDiscountPercentage(data.discount_percentage)
      } else {
        alert('Invalid discount code')
      }
    } catch (error) {
      alert('Invalid discount code')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (!user) {
        alert('Please sign in to place an order')
        navigate('/auth')
        return
      }

      const totalPrice = getCartTotal()
      const appliedDiscountPercentage = Math.max(discountPercentage, codeDiscountPercentage)
      const discountAmount = (totalPrice * appliedDiscountPercentage) / 100
      const finalPrice = discountCode ? getFinalTotal() : totalPrice - discountAmount
      const appliedDiscountCode = discountCode || (codeDiscountPercentage > 0 ? promoCode : null)

      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_amount: finalPrice,
          discount_amount: discountAmount,
          discount_code: appliedDiscountCode,
          discount_percentage: appliedDiscountPercentage,
          customer_email: shippingInfo.email,
          customer_mobile: shippingInfo.mobile_number,
          customer_alternate_mobile: shippingInfo.alternate_mobile,
          shipping_country: shippingInfo.country,
          shipping_state: shippingInfo.state,
          shipping_city: shippingInfo.city,
          shipping_pin_code: shippingInfo.pin_code,
          status: 'pending'
        })
        .select()
        .single()

      if (orderError) {
        console.error('Error creating order:', orderError)
        alert('Error placing order. Please try again.')
        return
      }

      // Create order items
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        product_name: item.product?.name || 'Unknown Product',
        product_price: item.product?.price || 0,
        size: item.size,
        quantity: item.quantity,
        item_total: (item.product?.price || 0) * item.quantity
      }))

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

      if (itemsError) {
        console.error('Error creating order items:', itemsError)
        alert('Error placing order. Please try again.')
        return
      }

      // Update/create user profile with shipping info
      await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: shippingInfo.email,
          mobile_number: shippingInfo.mobile_number,
          alternate_mobile: shippingInfo.alternate_mobile,
          country: shippingInfo.country,
          state: shippingInfo.state,
          city: shippingInfo.city,
          pin_code: shippingInfo.pin_code
        })

      // Clear cart
      await clearCart()
      
      alert(`Order placed successfully! Order number: ${order.order_number}`)
      navigate('/profile?tab=orders')
    } catch (error) {
      console.error('Error placing order:', error)
      alert('Error placing order. Please try again.')
    }

    setLoading(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingInfo(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const totalPrice = getCartTotal()
  const appliedDiscountPercentage = Math.max(discountPercentage, codeDiscountPercentage)
  const finalPrice = discountCode ? getFinalTotal() : totalPrice * (1 - appliedDiscountPercentage / 100)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-display text-3xl font-bold text-navy-900 mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="font-heading text-xl font-semibold text-gray-900 mb-4">
                {user ? 'Shipping Information' : 'Guest Checkout'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 font-heading mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={shippingInfo.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 font-body"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 font-heading mb-1">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      name="mobile_number"
                      required
                      value={shippingInfo.mobile_number}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 font-body"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 font-heading mb-1">
                      Alternate Mobile
                    </label>
                    <input
                      type="tel"
                      name="alternate_mobile"
                      value={shippingInfo.alternate_mobile}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 font-body"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 font-heading mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    required
                    value={shippingInfo.country}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 font-body"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 font-heading mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      name="state"
                      required
                      value={shippingInfo.state}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 font-body"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 font-heading mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={shippingInfo.city}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 font-body"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 font-heading mb-1">
                    PIN Code
                  </label>
                  <input
                    type="text"
                    name="pin_code"
                    required
                    value={shippingInfo.pin_code}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 font-body"
                  />
                </div>
              </form>
            </div>

            {/* Discount Code Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-heading text-lg font-semibold text-gray-900 mb-4">Discount Code</h3>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Enter discount code"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 font-body"
                />
                <button
                  type="button"
                  onClick={validateDiscountCode}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-heading font-medium transition-colors"
                >
                  Apply
                </button>
              </div>
              {codeDiscountPercentage > 0 && (
                <p className="mt-2 text-green-600 font-body">
                  Discount code applied: {codeDiscountPercentage}% off
                </p>
              )}
            </div>
          </div>

          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-heading text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
              
              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="font-body text-gray-600">
                      {item.product?.name || 'Product Not Found'} ({item.size}) × {item.quantity}
                    </span>
                    <span className="font-semibold">
                      ${((item.product?.price || 0) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="font-body text-gray-600">Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                
                {(discountPercentage > 0 || codeDiscountPercentage > 0) && (
                  <div className="flex justify-between text-green-600">
                    <span className="font-body">
                      Discount ({appliedDiscountPercentage}%)
                      {discountCode && <span className="text-xs ml-1">({discountCode})</span>}
                    </span>
                    <span>-${(totalPrice * appliedDiscountPercentage / 100).toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="font-body text-gray-600">Shipping</span>
                  <span>Free</span>
                </div>
                
                <div className="flex justify-between text-lg font-semibold text-gray-900 border-t border-gray-200 pt-2">
                  <span>Total</span>
                  <span>${finalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white py-3 px-4 rounded-lg font-heading font-semibold text-lg transition-colors duration-200"
            >
              {loading ? 'Processing...' : `Place Order - $${finalPrice.toFixed(2)}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}