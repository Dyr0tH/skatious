import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, User, LogOut, Settings, Dice6, UserCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { supabase } from '../lib/supabase'
import DiceRollModal from './DiceRollModal'

export default function Header() {
  const { user, signOut, isAdmin } = useAuth()
  const { getCartCount, applyDiscount } = useCart()
  const navigate = useNavigate()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showDiceModal, setShowDiceModal] = useState(false)
  const [specialDiscountActive, setSpecialDiscountActive] = useState(false)

  useEffect(() => {
    checkSpecialDiscountStatus()
  }, [])

  const checkSpecialDiscountStatus = async () => {
    const { data } = await supabase
      .from('special_discount_settings')
      .select('active')
      .eq('id', '00000000-0000-0000-0000-000000000001')
      .maybeSingle()
    
    setSpecialDiscountActive(data?.active || false)
  }

  const handleSignOut = async () => {
    await signOut()
    setShowUserMenu(false)
    navigate('/')
  }

  const handleDiceRoll = () => {
    if (user) {
      setShowDiceModal(true)
    } else {
      navigate('/auth')
    }
  }

  const handleDiscountApplied = (discountCode: string, discountPercentage: number) => {
    applyDiscount(discountCode, discountPercentage)
  }

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="font-display text-xl font-bold text-navy-900">SKATIOUS</span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                to="/"
                className="font-heading text-gray-700 hover:text-emerald-600 transition-colors duration-200"
              >
                Home
              </Link>
              <Link
                to="/products"
                className="font-heading text-gray-700 hover:text-emerald-600 transition-colors duration-200"
              >
                Products
              </Link>
              <Link
                to="/about"
                className="font-heading text-gray-700 hover:text-emerald-600 transition-colors duration-200"
              >
                About
              </Link>
            </nav>

            {/* Right side actions */}
            <div className="flex items-center space-x-4">
              {/* Dice Roll Button - only show if special discount is active and user is logged in */}
              {specialDiscountActive && user && (
                <button
                  onClick={handleDiceRoll}
                  className="p-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors duration-200"
                  title="Roll for discount"
                >
                  <Dice6 className="h-5 w-5" />
                </button>
              )}

              {/* Cart */}
              <Link
                to="/cart"
                className="relative p-2 text-gray-700 hover:text-emerald-600 transition-colors duration-200"
              >
                <ShoppingCart className="h-5 w-5" />
                {getCartCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-heading font-semibold">
                    {getCartCount()}
                  </span>
                )}
              </Link>

              {/* User Menu */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="p-2 text-gray-700 hover:text-emerald-600 transition-colors duration-200"
                  >
                    <User className="h-5 w-5" />
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="font-heading text-sm font-medium text-gray-900 truncate">
                          {user.email}
                        </p>
                      </div>
                      
                      <Link
                        to="/profile"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 font-heading"
                      >
                        <UserCircle className="h-4 w-4 mr-2" />
                        My Profile
                      </Link>
                      
                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 font-heading"
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          Admin Panel
                        </Link>
                      )}
                      
                      <button
                        onClick={handleSignOut}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 font-heading"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/auth"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-heading font-medium transition-colors duration-200"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-gray-100">
          <nav className="flex justify-around py-2">
            <Link
              to="/"
              className="font-heading text-sm text-gray-700 hover:text-emerald-600 py-2"
            >
              Home
            </Link>
            <Link
              to="/products"
              className="font-heading text-sm text-gray-700 hover:text-emerald-600 py-2"
            >
              Products
            </Link>
            <Link
              to="/about"
              className="font-heading text-sm text-gray-700 hover:text-emerald-600 py-2"
            >
              About
            </Link>
            {specialDiscountActive && user && (
              <button
                onClick={handleDiceRoll}
                className="font-heading text-sm text-emerald-600 hover:text-emerald-700 py-2"
              >
                🎲 Roll
              </button>
            )}
          </nav>
        </div>
      </header>

      {/* Special Discount Strip */}
      {specialDiscountActive && (
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 text-white py-3 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center space-x-4">
              <div className="flex items-center space-x-2">
                <Dice6 className="h-5 w-5 animate-bounce" />
                <span className="font-heading font-semibold">
                  🎉 Special Lucky Discount! Roll the dice for up to 12% off!
                </span>
              </div>
              {user ? (
                <button
                  onClick={handleDiceRoll}
                  className="bg-white text-purple-600 px-4 py-1 rounded-full font-heading font-semibold text-sm hover:bg-gray-100 transition-colors duration-200 flex items-center space-x-1"
                >
                  <Dice6 className="h-4 w-4" />
                  <span>Roll Now</span>
                </button>
              ) : (
                <Link
                  to="/auth"
                  className="bg-white text-purple-600 px-4 py-1 rounded-full font-heading font-semibold text-sm hover:bg-gray-100 transition-colors duration-200"
                >
                  Sign In to Roll
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Dice Roll Modal */}
      <DiceRollModal
        isOpen={showDiceModal}
        onClose={() => setShowDiceModal(false)}
        onDiscountApplied={handleDiscountApplied}
      />
    </>
  )
}