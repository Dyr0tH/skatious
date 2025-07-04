import React, { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { Phone, Shield } from 'lucide-react'

export default function AuthPage() {
  const { user, signUp } = useAuth()
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [otpLoading, setOtpLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    mobile_number: '',
    alternate_mobile: '',
    country: '',
    state: '',
    city: '',
    pin_code: '',
    otp: '',
  })

  if (user) {
    return <Navigate to="/" replace />
  }

  const sendOTP = async () => {
    if (!formData.mobile_number) {
      setError('Please enter your mobile number')
      return
    }

    setOtpLoading(true)
    setError('')

    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: formData.mobile_number,
      })

      if (error) throw error

      setOtpSent(true)
      setError('')
    } catch (error: any) {
      setError(error.message || 'Failed to send OTP')
    }

    setOtpLoading(false)
  }

  const verifyOTP = async () => {
    if (!formData.otp) {
      setError('Please enter the OTP')
      return
    }

    setLoading(true)
    setError('')

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone: formData.mobile_number,
        token: formData.otp,
        type: 'sms'
      })

      if (error) throw error

      // If this is a new user (sign up), create their profile
      if (data.user && isSignUp) {
        const { error: profileError } = await supabase.from('profiles').insert({
          id: data.user.id,
          full_name: formData.full_name,
          email: formData.email || data.user.email || '',
          mobile_number: formData.mobile_number,
          alternate_mobile: formData.alternate_mobile || null,
          country: formData.country || null,
          state: formData.state || null,
          city: formData.city || null,
          pin_code: formData.pin_code || null,
        })

        if (profileError) {
          console.error('Error creating profile:', profileError)
        }
      }
    } catch (error: any) {
      setError(error.message || 'Invalid OTP')
    }

    setLoading(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const resetForm = () => {
    setOtpSent(false)
    setError('')
    setFormData(prev => ({ ...prev, otp: '' }))
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold text-navy-900">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="mt-2 font-body text-gray-600">
            {isSignUp ? 'Join the SKATIOUS community' : 'Sign in with your mobile number'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Mobile OTP Authentication */}
        <div className="space-y-6">
          {isSignUp && (
            <div>
              <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 font-heading">
                Full Name
              </label>
              <input
                id="full_name"
                name="full_name"
                type="text"
                required
                value={formData.full_name}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 font-body"
              />
            </div>
          )}

          {isSignUp && (
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 font-heading">
                Email Address (Optional)
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 font-body"
              />
            </div>
          )}

          <div>
            <label htmlFor="mobile_number" className="block text-sm font-medium text-gray-700 font-heading">
              <Phone className="h-4 w-4 inline mr-1" />
              Mobile Number
            </label>
            <div className="mt-1 flex space-x-2">
              <input
                id="mobile_number"
                name="mobile_number"
                type="tel"
                required
                value={formData.mobile_number}
                onChange={handleChange}
                disabled={otpSent}
                placeholder="+1234567890"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 font-body disabled:bg-gray-50"
              />
              {!otpSent ? (
                <button
                  type="button"
                  onClick={sendOTP}
                  disabled={otpLoading || !formData.mobile_number}
                  className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white px-4 py-2 rounded-lg font-heading font-medium transition-colors duration-200"
                >
                  {otpLoading ? 'Sending...' : 'Send OTP'}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg font-heading font-medium transition-colors duration-200"
                >
                  Change
                </button>
              )}
            </div>
          </div>

          {otpSent && (
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 font-heading">
                <Shield className="h-4 w-4 inline mr-1" />
                Enter OTP
              </label>
              <input
                id="otp"
                name="otp"
                type="text"
                required
                value={formData.otp}
                onChange={handleChange}
                placeholder="123456"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 font-body"
              />
              <p className="mt-2 text-sm text-gray-600 font-body">
                OTP sent to {formData.mobile_number}
              </p>
            </div>
          )}

          {isSignUp && otpSent && (
            <>
              <div>
                <label htmlFor="alternate_mobile" className="block text-sm font-medium text-gray-700 font-heading">
                  Alternate Mobile
                </label>
                <input
                  id="alternate_mobile"
                  name="alternate_mobile"
                  type="tel"
                  value={formData.alternate_mobile}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 font-body"
                />
              </div>

              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 font-heading">
                  Country
                </label>
                <input
                  id="country"
                  name="country"
                  type="text"
                  required
                  value={formData.country}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 font-body"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700 font-heading">
                    State
                  </label>
                  <input
                    id="state"
                    name="state"
                    type="text"
                    required
                    value={formData.state}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 font-body"
                  />
                </div>

                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 font-heading">
                    City
                  </label>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 font-body"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="pin_code" className="block text-sm font-medium text-gray-700 font-heading">
                  PIN Code
                </label>
                <input
                  id="pin_code"
                  name="pin_code"
                  type="text"
                  required
                  value={formData.pin_code}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 font-body"
                />
              </div>

              {/* Verify and Signup Button - Moved to the end */}
              <button
                type="button"
                onClick={verifyOTP}
                disabled={loading || !formData.otp}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white py-3 px-4 rounded-lg font-heading font-semibold text-lg transition-colors duration-200"
              >
                {loading ? 'Verifying...' : 'Verify and Signup'}
              </button>
            </>
          )}

          {/* Sign In with Mobile OTP */}
          {!isSignUp && otpSent && (
            <button
              type="button"
              onClick={verifyOTP}
              disabled={loading || !formData.otp}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white py-3 px-4 rounded-lg font-heading font-semibold text-lg transition-colors duration-200"
            >
              {loading ? 'Verifying...' : 'Verify and Sign In'}
            </button>
          )}
        </div>

        <div className="text-center">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp)
              resetForm()
            }}
            className="text-emerald-600 hover:text-emerald-700 font-heading font-medium"
          >
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  )
}