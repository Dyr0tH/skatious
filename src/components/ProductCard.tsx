import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCart } from 'lucide-react'
import { useCart } from '../context/CartContext'

interface Product {
  id: string
  name: string
  description: string
  price: number
  sizes: string[]
  in_stock: boolean
  image_url: string
}

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart()
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || '')
  const [isAdding, setIsAdding] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!selectedSize) return
    
    setIsAdding(true)
    await addToCart(product.id, selectedSize, 1)
    setIsAdding(false)
  }

  return (
    <div 
      className="group relative bg-white rounded-2xl border-2 border-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Vertical Layout Container */}
      <div className="flex flex-col h-full">
        {/* Top - Image Box */}
        <div className="relative bg-gray-50 overflow-hidden h-56 sm:h-60 md:h-64 lg:h-72 rounded-xl m-2">
          <Link to={`/product/${product.id}`}>
            <img
              src={product.image_url}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          {/* gradient overlay for readability on hover */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Product Name - Bottom Center of Image */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-full flex justify-center px-3">
            <Link to={`/product/${product.id}`}>
              <h3 className="inline-block text-sm font-bold text-white bg-black/60 px-3 py-1.5 rounded-lg backdrop-blur-sm line-clamp-2 text-center max-w-[90%] transition-transform duration-200 ease-out transform-gpu group-hover:translate-x-10">
                {product.name}
              </h3>
            </Link>
          </div>
        </div>

        {/* Bottom - Content */}

        {/* Bottom - Content */}
        <div className="p-4 flex flex-col justify-between flex-1">
          {/* Top Section - Description & Price */}
          <div className="space-y-3">
            <div>
              <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                DESC
              </h4>
              <p className="text-gray-800 text-xs leading-relaxed line-clamp-2">
                {product.description}
              </p>
            </div>

            {/* Price */}
            <div>
              <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                PRICE
              </h4>
              <div className="text-lg font-bold text-gray-900">
                ₹{product.price.toLocaleString('en-IN')}
              </div>
            </div>

            {/* Size Selector */}
            {product.sizes.length > 0 && product.in_stock && (
              <div>
                <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                  SIZE
                </h4>
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="w-full px-2 py-1 border-2 border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-gray-800"
                  onClick={(e) => e.stopPropagation()}
                >
                  {product.sizes.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Bottom Section - Add to Cart Button */}
          <div className="mt-3">
            {product.in_stock ? (
              <button
                onClick={handleAddToCart}
                disabled={isAdding || !selectedSize}
                className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider text-xs"
              >
                {isAdding ? (
                  <>
                    <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Adding...</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-3 w-3" />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>
            ) : (
              <button
                disabled
                className="w-full bg-gray-300 text-gray-500 font-semibold py-2 px-4 rounded cursor-not-allowed uppercase tracking-wider text-xs"
              >
                Out of Stock
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Removed Heart Button as requested */}
    </div>
  )
}