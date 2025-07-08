import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCart, Heart } from 'lucide-react'
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

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!selectedSize) return
    
    setIsAdding(true)
    await addToCart(product.id, selectedSize, 1)
    setIsAdding(false)
  }

  return (
    <div className="group relative bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
      <Link to={`/product/${product.id}`}>
        <div className="aspect-square overflow-hidden bg-gray-100">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </Link>
      
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors">
          <Heart className="h-4 w-4 text-gray-600" />
        </button>
      </div>

      <div className="p-6">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-heading text-lg font-semibold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 font-body">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="text-2xl font-bold text-navy-800">
            ₹{product.price.toFixed(2)}
          </div>
          
          {product.sizes.length > 0 && product.in_stock && (
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="text-sm border border-gray-200 rounded-md px-2 py-1 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              onClick={(e) => e.stopPropagation()}
            >
              {product.sizes.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          )}
        </div>

        {product.in_stock ? (
          <button
            onClick={handleAddToCart}
            disabled={isAdding || !selectedSize}
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white py-2 px-4 rounded-lg font-heading font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>{isAdding ? 'Adding...' : 'Add to Cart'}</span>
          </button>
        ) : (
          <div className="w-full bg-red-100 text-red-800 py-2 px-4 rounded-lg font-heading font-medium text-center border border-red-200">
            <div className="flex items-center justify-center space-x-2">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>Out of Stock</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}