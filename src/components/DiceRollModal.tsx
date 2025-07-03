import React, { useState, useEffect } from 'react'
import { X, Dice6 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

interface DiceRollModalProps {
  isOpen: boolean
  onClose: () => void
  onDiscountApplied: (discountCode: string, discountPercentage: number) => void
}

export default function DiceRollModal({ isOpen, onClose, onDiscountApplied }: DiceRollModalProps) {
  const { user } = useAuth()
  const [isRolling, setIsRolling] = useState(false)
  const [dice1Result, setDice1Result] = useState<number | null>(null)
  const [dice2Result, setDice2Result] = useState<number | null>(null)
  const [discountPercentage, setDiscountPercentage] = useState<number | null>(null)
  const [discountCode, setDiscountCode] = useState<string | null>(null)
  const [hasRolledToday, setHasRolledToday] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isOpen && user) {
      checkTodayRoll()
    }
  }, [isOpen, user])

  const checkTodayRoll = async () => {
    if (!user) return

    const today = new Date().toISOString().split('T')[0]
    const { data } = await supabase
      .from('user_dice_rolls')
      .select('*')
      .eq('user_id', user.id)
      .gte('created_at', `${today}T00:00:00.000Z`)
      .lt('created_at', `${today}T23:59:59.999Z`)
      .order('created_at', { ascending: false })
      .limit(1)

    if (data && data.length > 0) {
      const todayRoll = data[0]
      setHasRolledToday(true)
      // Parse the roll result to get both dice values
      const rollResult = todayRoll.roll_result
      setDice1Result(Math.floor(rollResult / 10)) // First digit
      setDice2Result(rollResult % 10) // Second digit
      setDiscountPercentage(todayRoll.discount_percentage)
      
      // Generate the discount code for today's roll
      const code = generateDiscountCode(user.id, rollResult)
      setDiscountCode(code)
    }
    
    setLoading(false)
  }

  const generateDiscountCode = (userId: string, rollResult: number) => {
    const userPrefix = userId.substring(0, 4).toUpperCase()
    const date = new Date().toISOString().split('T')[0].replace(/-/g, '')
    return `DICE${userPrefix}${rollResult}${date}`
  }

  const rollDice = async () => {
    if (!user || hasRolledToday) return

    setIsRolling(true)
    
    // Simulate dice rolling animation
    const rollAnimation = setInterval(() => {
      setDice1Result(Math.floor(Math.random() * 6) + 1)
      setDice2Result(Math.floor(Math.random() * 6) + 1)
    }, 100)

    setTimeout(async () => {
      clearInterval(rollAnimation)
      
      const finalDice1 = Math.floor(Math.random() * 6) + 1
      const finalDice2 = Math.floor(Math.random() * 6) + 1
      const discount = finalDice1 + finalDice2
      // Store both dice results as a two-digit number (e.g., dice1=3, dice2=5 becomes 35)
      const combinedRoll = finalDice1 * 10 + finalDice2
      const code = generateDiscountCode(user.id, combinedRoll)
      
      setDice1Result(finalDice1)
      setDice2Result(finalDice2)
      setDiscountPercentage(discount)
      setDiscountCode(code)
      setIsRolling(false)
      setHasRolledToday(true)

      // Save to database
      await supabase.from('user_dice_rolls').insert({
        user_id: user.id,
        roll_result: combinedRoll,
        discount_percentage: discount
      })

      // Apply discount to cart
      onDiscountApplied(code, discount)
    }, 2000)
  }

  const applyDiscount = () => {
    if (discountCode && discountPercentage) {
      onDiscountApplied(discountCode, discountPercentage)
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 text-center">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-display text-2xl font-bold text-navy-900">Lucky Dice Roll</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {loading ? (
          <div className="py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
            <p className="font-body text-gray-600 mt-4">Checking your luck...</p>
          </div>
        ) : hasRolledToday ? (
          <div className="space-y-6">
            <div className="bg-emerald-50 rounded-lg p-6">
              <div className="flex justify-center space-x-4 mb-4">
                <div className="text-4xl">🎲</div>
                <div className="text-4xl">🎲</div>
              </div>
              <p className="font-heading text-lg text-gray-700 mb-2">You rolled</p>
              <div className="flex justify-center items-center space-x-2 mb-2">
                <div className="text-3xl font-bold text-emerald-600">{dice1Result}</div>
                <div className="text-2xl text-gray-500">+</div>
                <div className="text-3xl font-bold text-emerald-600">{dice2Result}</div>
                <div className="text-2xl text-gray-500">=</div>
                <div className="text-3xl font-bold text-emerald-600">{discountPercentage}</div>
              </div>
              <p className="font-heading text-xl text-navy-900 font-semibold">
                {discountPercentage}% Discount!
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="font-heading text-sm text-gray-600 mb-2">Your discount code:</p>
              <div className="font-mono text-lg font-bold text-navy-900 bg-white px-4 py-2 rounded border">
                {discountCode}
              </div>
            </div>

            <button
              onClick={applyDiscount}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-6 rounded-lg font-heading font-semibold transition-colors duration-200"
            >
              Apply to Cart
            </button>
            
            <p className="font-body text-sm text-gray-500">
              You can only roll once per day. Come back tomorrow for another chance!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="py-8">
              {isRolling ? (
                <div>
                  <div className="flex justify-center space-x-4 mb-4">
                    <div className="text-6xl animate-bounce">🎲</div>
                    <div className="text-6xl animate-bounce" style={{ animationDelay: '0.1s' }}>🎲</div>
                  </div>
                  <p className="font-heading text-lg text-gray-700">Rolling...</p>
                </div>
              ) : dice1Result && dice2Result ? (
                <div>
                  <div className="flex justify-center space-x-4 mb-4">
                    <div className="text-4xl">🎲</div>
                    <div className="text-4xl">🎲</div>
                  </div>
                  <div className="flex justify-center items-center space-x-2 mb-4">
                    <div className="text-4xl font-bold text-emerald-600">{dice1Result}</div>
                    <div className="text-2xl text-gray-500">+</div>
                    <div className="text-4xl font-bold text-emerald-600">{dice2Result}</div>
                    <div className="text-2xl text-gray-500">=</div>
                    <div className="text-4xl font-bold text-emerald-600">{discountPercentage}</div>
                  </div>
                  <p className="font-heading text-xl text-navy-900 font-semibold mb-2">
                    {discountPercentage}% Discount!
                  </p>
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <p className="font-heading text-sm text-gray-600 mb-2">Your discount code:</p>
                    <div className="font-mono text-lg font-bold text-navy-900">
                      {discountCode}
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex justify-center space-x-4 mb-4">
                    <Dice6 className="h-16 w-16 text-emerald-600" />
                    <Dice6 className="h-16 w-16 text-emerald-600" />
                  </div>
                  <p className="font-heading text-lg text-gray-700 mb-2">
                    Roll two dice for a discount!
                  </p>
                  <p className="font-body text-sm text-gray-500 mb-6">
                    Get a discount equal to the sum of both dice (2% to 12% off)
                  </p>
                </div>
              )}
            </div>

            {!isRolling && !dice1Result && (
              <button
                onClick={rollDice}
                disabled={isRolling}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white py-3 px-6 rounded-lg font-heading font-semibold transition-colors duration-200"
              >
                Roll the Dice!
              </button>
            )}

            {dice1Result && dice2Result && (
              <button
                onClick={applyDiscount}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-6 rounded-lg font-heading font-semibold transition-colors duration-200"
              >
                Apply to Cart
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}