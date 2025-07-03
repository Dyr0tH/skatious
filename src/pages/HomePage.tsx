import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Star, Users, Award } from 'lucide-react'
import { supabase } from '../lib/supabase'
import ProductCard from '../components/ProductCard'

interface Product {
  id: string
  name: string
  description: string
  price: number
  sizes: string[]
  image_url: string
}

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadFeaturedProducts()
  }, [])

  const loadFeaturedProducts = async () => {
    try {
      const { data: products } = await supabase
        .from('products')
        .select(`
          id,
          name,
          description,
          price,
          sizes,
          product_images!inner (
            image_url,
            order_index
          )
        `)
        .limit(6)

      if (products) {
        const formattedProducts = products.map(product => ({
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          sizes: product.sizes,
          image_url: product.product_images[0]?.image_url || 'https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg',
        }))
        setFeaturedProducts(formattedProducts)
      }
    } catch (error) {
      console.error('Error loading featured products:', error)
      // Mock data for demonstration
      setFeaturedProducts([
        {
          id: '1',
          name: 'Premium Cotton Tee',
          description: 'Soft, comfortable cotton t-shirt with modern fit',
          price: 29.99,
          sizes: ['XS', 'S', 'M', 'L', 'XL'],
          image_url: 'https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg'
        },
        {
          id: '2',
          name: 'Urban Hoodie',
          description: 'Stylish hoodie perfect for casual wear and street style',
          price: 49.99,
          sizes: ['S', 'M', 'L', 'XL', 'XXL'],
          image_url: 'https://images.pexels.com/photos/1629781/pexels-photo-1629781.jpeg'
        },
        {
          id: '3',
          name: 'Classic Denim Jacket',
          description: 'Timeless denim jacket with modern styling',
          price: 79.99,
          sizes: ['XS', 'S', 'M', 'L', 'XL'],
          image_url: 'https://images.pexels.com/photos/1010973/pexels-photo-1010973.jpeg'
        }
      ])
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-navy-900 via-navy-800 to-emerald-900 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in">
              Elevate Your
              <span className="text-emerald-400 block">Style Experience</span>
            </h1>
            <p className="font-body text-xl sm:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto animate-slide-up">
              Discover premium clothing crafted for those who demand excellence, style, and comfort in every piece.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
              <Link
                to="/products"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg font-heading font-semibold text-lg transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <span>Shop Collection</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to="/about"
                className="border-2 border-white text-white hover:bg-white hover:text-navy-900 px-8 py-3 rounded-lg font-heading font-semibold text-lg transition-all duration-200"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-navy-900 mb-4">
              Why Choose SKATIOUS?
            </h2>
            <p className="font-body text-gray-600 text-lg max-w-2xl mx-auto">
              We're not just selling clothes; we're building a community of style-conscious individuals.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="font-heading text-xl font-semibold text-navy-900 mb-3">Premium Quality</h3>
              <p className="font-body text-gray-600">
                Hand-selected materials and meticulous craftsmanship in every piece we create.
              </p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="font-heading text-xl font-semibold text-navy-900 mb-3">Community First</h3>
              <p className="font-body text-gray-600">
                Built by fashion enthusiasts, for fashion enthusiasts. We understand what the community needs and wants.
              </p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="font-heading text-xl font-semibold text-navy-900 mb-3">Expert Support</h3>
              <p className="font-body text-gray-600">
                Our team of style experts is here to help you find the perfect pieces for your wardrobe.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-navy-900 mb-4">
              Featured Products
            </h2>
            <p className="font-body text-gray-600 text-lg">
              Discover our most popular clothing pieces chosen by style enthusiasts worldwide.
            </p>
          </div>
          
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-200 animate-pulse rounded-xl h-96"></div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
          
          <div className="text-center mt-12">
            <Link
              to="/products"
              className="bg-navy-800 hover:bg-navy-900 text-white px-8 py-3 rounded-lg font-heading font-semibold text-lg transition-colors duration-200 inline-flex items-center space-x-2"
            >
              <span>View All Products</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-emerald-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl font-bold text-white mb-4">
            Stay in the Loop
          </h2>
          <p className="font-body text-emerald-100 text-lg mb-8">
            Get the latest updates on new collections, exclusive deals, and style tips.
          </p>
          
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg border border-emerald-400 focus:ring-2 focus:ring-white focus:border-transparent font-body"
            />
            <button
              type="submit"
              className="bg-white text-emerald-600 px-6 py-3 rounded-lg font-heading font-semibold hover:bg-gray-100 transition-colors duration-200"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}