import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, ShoppingCart, Heart, Star, Package, Truck, Shield } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useCart } from '../context/CartContext'

interface Product {
  id: string
  name: string
  description: string
  price: number
  sizes: string[]
  category?: { name: string }
  product_images: {
    image_url: string
    order_index: number
    alt_text: string
  }[]
}

export default function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>()
  const { addToCart } = useCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isAdding, setIsAdding] = useState(false)
  const [error, setError] = useState('')
  const [reviewRating, setReviewRating] = useState(0)
  const [reviewText, setReviewText] = useState('')
  const [isSubmittingReview, setIsSubmittingReview] = useState(false)

  useEffect(() => {
    if (productId) {
      loadProduct()
    }
  }, [productId])

  const loadProduct = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('products')
        .select(`
          id,
          name,
          description,
          price,
          sizes,
          categories (
            name
          ),
          product_images (
            image_url,
            order_index,
            alt_text
          )
        `)
        .eq('id', productId)
        .single()

      if (error) {
        console.error('Error loading product:', error)
        setError('Product not found')
        return
      }

      if (data) {
        setProduct(data)
        if (data.sizes.length > 0) {
          setSelectedSize(data.sizes[0])
        }
      }
    } catch (err) {
      console.error('Error loading product:', err)
      setError('Failed to load product')
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async () => {
    if (!product || !selectedSize) return
    
    setIsAdding(true)
    await addToCart(product.id, selectedSize, 1)
    setIsAdding(false)
  }

  const handleSubmitReview = async () => {
    if (!reviewRating || !reviewText.trim()) return
    
    setIsSubmittingReview(true)
    
    // Mock submission - in real implementation, this would save to database
    setTimeout(() => {
      console.log('Review submitted:', {
        productId: product?.id,
        rating: reviewRating,
        text: reviewText
      })
      
      // Reset form
      setReviewRating(0)
      setReviewText('')
      setIsSubmittingReview(false)
      
      // Show success message (you could add a toast notification here)
      alert('Review submitted successfully!')
    }, 1000)
  }

  // Mock reviews data
  const mockReviews = [
    {
      rating: 5,
      text: "Absolutely love this product! The quality is exceptional and it fits perfectly. Highly recommend!",
      customerName: "Sarah M.",
      date: "2 days ago"
    },
    {
      rating: 4,
      text: "Great product overall. The material is soft and comfortable. Would buy again.",
      customerName: "John D.",
      date: "1 week ago"
    },
    {
      rating: 5,
      text: "Exceeded my expectations! The design is modern and the fit is perfect. Very satisfied with my purchase.",
      customerName: "Emily R.",
      date: "2 weeks ago"
    }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 font-body text-gray-600">Loading product...</p>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="font-heading text-xl font-semibold text-gray-900 mb-2">Product Not Found</h2>
          <p className="font-body text-gray-600 mb-6">{error || 'The product you are looking for does not exist.'}</p>
          <Link
            to="/products"
            className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-heading font-medium transition-colors duration-200"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Products</span>
          </Link>
        </div>
      </div>
    )
  }

  const images = product.product_images.length > 0 
    ? product.product_images.sort((a, b) => a.order_index - b.order_index)
    : [{ image_url: 'https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg', order_index: 0, alt_text: product.name }]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <Link
            to="/products"
            className="inline-flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 font-body"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Products</span>
          </Link>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-white rounded-xl shadow-sm overflow-hidden">
              <img
                src={images[selectedImageIndex]?.image_url}
                alt={images[selectedImageIndex]?.alt_text || product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnail Images */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square bg-white rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImageIndex === index
                        ? 'border-emerald-500'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image.image_url}
                      alt={image.alt_text || product.name}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Category */}
            {product.category && (
              <div>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800">
                  {product.category.name}
                </span>
              </div>
            )}

            {/* Product Name */}
            <h1 className="font-display text-3xl font-bold text-gray-900">
              {product.name}
            </h1>

            {/* Price */}
            <div className="text-3xl font-bold text-navy-800">
              ₹{product.price.toFixed(2)}
            </div>

            {/* Description */}
            <div>
              <h3 className="font-heading text-lg font-semibold text-gray-900 mb-2">Description</h3>
              <p className="font-body text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Size Selection */}
            {product.sizes.length > 0 && (
              <div>
                <h3 className="font-heading text-lg font-semibold text-gray-900 mb-3">Select Size</h3>
                <div className="grid grid-cols-3 gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-3 px-4 rounded-lg border-2 font-heading font-medium transition-colors ${
                        selectedSize === size
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Add to Cart */}
            <div className="space-y-4">
              <button
                onClick={handleAddToCart}
                disabled={isAdding || !selectedSize}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white py-4 px-6 rounded-lg font-heading font-semibold text-lg transition-colors duration-200 flex items-center justify-center space-x-3"
              >
                <ShoppingCart className="h-5 w-5" />
                <span>{isAdding ? 'Adding to Cart...' : 'Add to Cart'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Reviews Section - Full Width */}
        <div className="mt-16">
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h3 className="font-heading text-2xl font-semibold text-gray-900 mb-6">Customer Reviews</h3>
            
            {/* Leave a Review Form */}
            <div className="border-b border-gray-200 pb-8 mb-8">
              <h4 className="font-heading text-lg font-semibold text-gray-900 mb-4">Leave a Review</h4>
              
              {/* Star Rating */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 font-heading mb-2">
                  Your Rating
                </label>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setReviewRating(star)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`h-6 w-6 transition-colors ${
                          reviewRating >= star
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300 hover:text-yellow-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-gray-600 font-body">
                    {reviewRating > 0 ? `${reviewRating} out of 5` : 'Click to rate'}
                  </span>
                </div>
              </div>

              {/* Review Text */}
              <div className="mb-4">
                <label htmlFor="review" className="block text-sm font-medium text-gray-700 font-heading mb-2">
                  Your Review
                </label>
                <textarea
                  id="review"
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share your thoughts about this product..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 font-body resize-none"
                />
              </div>

              {/* Submit Review Button */}
              <button
                onClick={handleSubmitReview}
                disabled={!reviewRating || !reviewText.trim() || isSubmittingReview}
                className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white py-2 px-6 rounded-lg font-heading font-medium transition-colors duration-200 flex items-center space-x-2"
              >
                {isSubmittingReview ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Star className="h-4 w-4" />
                    <span>Submit Review</span>
                  </>
                )}
              </button>
            </div>

            {/* Reviews Display */}
            <div>
              <h4 className="font-heading text-lg font-semibold text-gray-900 mb-4">All Reviews</h4>
              <div className="space-y-6">
                {mockReviews.map((review, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-5 w-5 ${
                              star <= review.rating
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="ml-2 text-sm font-medium text-gray-900">
                          {review.rating} out of 5
                        </span>
                      </div>
                      <span className="text-sm text-gray-500 font-body">
                        {review.date}
                      </span>
                    </div>
                    <p className="text-gray-700 font-body leading-relaxed mb-3">{review.text}</p>
                    <p className="text-sm text-gray-500 font-body">- {review.customerName}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 