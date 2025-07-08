import React, { useEffect, useState } from 'react'
import { Filter, Search } from 'lucide-react'
import { supabase } from '../lib/supabase'
import ProductCard from '../components/ProductCard'

interface Product {
  id: string
  name: string
  description: string
  price: number
  sizes: string[]
  in_stock: boolean
  image_url: string
  category?: { name: string }
}

interface Category {
  id: string
  name: string
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [sortBy, setSortBy] = useState('name')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      // Load categories
      const { data: categoriesData } = await supabase
        .from('categories')
        .select('id, name')
        .order('name')

      if (categoriesData) {
        setCategories(categoriesData)
      }

      // Load products with images
      const { data: productsData } = await supabase
        .from('products')
        .select(`
          id,
          name,
          description,
          price,
          sizes,
          in_stock,
          categories (
            name
          ),
          product_images!inner (
            image_url,
            order_index
          )
        `)
        .order('name')

      if (productsData) {
        const formattedProducts = productsData.map(product => ({
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          sizes: product.sizes,
          in_stock: product.in_stock,
          image_url: product.product_images[0]?.image_url || 'https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg',
          category: product.categories
        }))
        setProducts(formattedProducts)
      }
    } catch (error) {
      console.error('Error loading data:', error)
      // Mock data for demonstration
      setProducts([
        {
          id: '1',
          name: 'Premium Cotton Tee',
          description: 'Soft, comfortable cotton t-shirt with modern fit',
          price: 29.99,
          sizes: ['XS', 'S', 'M', 'L', 'XL'],
          in_stock: true,
          image_url: 'https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg',
          category: { name: 'T-Shirts' }
        },
        {
          id: '2',
          name: 'Urban Hoodie',
          description: 'Stylish hoodie perfect for casual wear and street style',
          price: 49.99,
          sizes: ['S', 'M', 'L', 'XL', 'XXL'],
          in_stock: true,
          image_url: 'https://images.pexels.com/photos/1629781/pexels-photo-1629781.jpeg',
          category: { name: 'Hoodies' }
        },
        {
          id: '3',
          name: 'Classic Denim Jacket',
          description: 'Timeless denim jacket with modern styling',
          price: 79.99,
          sizes: ['XS', 'S', 'M', 'L', 'XL'],
          in_stock: true,
          image_url: 'https://images.pexels.com/photos/1010973/pexels-photo-1010973.jpeg',
          category: { name: 'Jackets' }
        },
        {
          id: '4',
          name: 'Casual Joggers',
          description: 'Comfortable joggers perfect for lounging and workouts',
          price: 39.99,
          sizes: ['XS', 'S', 'M', 'L', 'XL'],
          in_stock: true,
          image_url: 'https://images.pexels.com/photos/2398220/pexels-photo-2398220.jpeg',
          category: { name: 'Pants' }
        }
      ])
      setCategories([
        { id: '1', name: 'T-Shirts' },
        { id: '2', name: 'Hoodies' },
        { id: '3', name: 'Jackets' },
        { id: '4', name: 'Pants' }
      ])
    }
    setLoading(false)
  }

  const filteredProducts = products
    .filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(product => 
      selectedCategory === '' || product.category?.name === selectedCategory
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        case 'name':
        default:
          return a.name.localeCompare(b.name)
      }
    })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl font-bold text-navy-900 mb-4">
            Our Collection
          </h1>
          <p className="font-body text-gray-600 text-lg max-w-2xl mx-auto">
            Discover premium clothing crafted for every style and occasion.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 font-body"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 font-body appearance-none"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 font-body"
              >
                <option value="name">Sort by Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>

            <div className="text-sm text-gray-600 flex items-center font-body">
              {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-200 animate-pulse rounded-xl h-96"></div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <Filter className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="font-heading text-xl font-semibold text-gray-900 mb-2">
              No products found
            </h3>
            <p className="font-body text-gray-600">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}