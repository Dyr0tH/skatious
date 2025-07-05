import React, { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { Phone, Shield } from 'lucide-react'

export default function AuthPage() {
  const { user, signUp, signIn } = useAuth()
  const [isSignUp, setIsSignUp] = useState(false)
  const [loginTab, setLoginTab] = useState<'mobile' | 'email'>('mobile')
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

  const [emailLogin, setEmailLogin] = useState({
    email: '',
    password: '',
  })

  if (user) {
    return <Navigate to="/" replace />
  }

  const checkUserExists = async (mobileNumber: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('mobile_number', mobileNumber)
        .maybeSingle()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      return !!data
    } catch (error) {
      console.error('Error checking user existence:', error)
      return false
    }
  }

  const sendOTP = async () => {
    if (!formData.mobile_number) {
      setError('Please enter your mobile number')
      return
    }

    setOtpLoading(true)
    setError('')

    try {
      // For sign-in, check if user exists first
      if (!isSignUp) {
        const userExists = await checkUserExists(formData.mobile_number)
        if (!userExists) {
          setError('No account found with this mobile number. Please sign up first.')
          setOtpLoading(false)
          return
        }
      }

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

      // If this is sign-in, verify the user exists in our profiles table
      if (!isSignUp && data.user) {
        const userExists = await checkUserExists(formData.mobile_number)
        if (!userExists) {
          // Sign out the user immediately if they don't exist in our system
          await supabase.auth.signOut()
          setError('Account not found. Please sign up first.')
          setLoading(false)
          return
        }
      }

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
          // If profile creation fails, sign out the user
          await supabase.auth.signOut()
          setError('Failed to create profile. Please try again.')
          setLoading(false)
          return
        }
      }
    } catch (error: any) {
      setError(error.message || 'Invalid OTP')
    }

    setLoading(false)
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { error } = await signIn(emailLogin.email, emailLogin.password)
      if (error) {
        setError(error.message || 'Login failed')
      }
    } catch (err: any) {
      setError(err.message || 'Login failed')
    }
    setLoading(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleEmailLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailLogin(prev => ({
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

        {!isSignUp && (
          <div className="flex justify-center mb-4">
            <button
              type="button"
              className={`px-4 py-2 font-heading font-medium rounded-t-lg focus:outline-none transition-colors duration-200 ${loginTab === 'mobile' ? 'bg-white border-b-2 border-emerald-600 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}
              onClick={() => setLoginTab('mobile')}
            >
              Mobile OTP
            </button>
            <button
              type="button"
              className={`px-4 py-2 font-heading font-medium rounded-t-lg focus:outline-none transition-colors duration-200 ml-2 ${loginTab === 'email' ? 'bg-white border-b-2 border-emerald-600 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}
              onClick={() => setLoginTab('email')}
            >
              Email & Password
            </button>
          </div>
        )}

        {((!isSignUp && loginTab === 'mobile') || isSignUp) && (
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
        )}

        {!isSignUp && loginTab === 'email' && (
          <form className="space-y-6" onSubmit={handleEmailLogin}>
            <div>
              <label htmlFor="email_login" className="block text-sm font-medium text-gray-700 font-heading">
                Email Address
              </label>
              <input
                id="email_login"
                name="email"
                type="email"
                required
                value={emailLogin.email}
                onChange={handleEmailLoginChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 font-body"
              />
            </div>
            <div>
              <label htmlFor="password_login" className="block text-sm font-medium text-gray-700 font-heading">
                Password
              </label>
              <input
                id="password_login"
                name="password"
                type="password"
                required
                value={emailLogin.password}
                onChange={handleEmailLoginChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 font-body"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white py-3 px-4 rounded-lg font-heading font-semibold text-lg transition-colors duration-200"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        )}

        <div className="text-center">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp)
              resetForm()
              setLoginTab('mobile')
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