import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Eye } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  sizes: string[];
  in_stock: boolean;
  image_url: string;
}

interface PremiumProductCardProps {
  product: Product;
  index: number;
}

export default function PremiumProductCard({ product, index }: PremiumProductCardProps) {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || '');
  const [isAdding, setIsAdding] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!selectedSize) return;
    
    setIsAdding(true);
    await addToCart(product.id, selectedSize, 1);
    setIsAdding(false);
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 60,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.21, 1.02, 0.73, 1]
      }
    }
  };

  const hoverVariants = {
    hover: {
      y: -10,
      scale: 1.02,
      rotateX: 5,
      rotateY: 2,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      whileHover="hover"
      className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden perspective-1000"
      style={{ transformStyle: 'preserve-3d' }}
    >
      <motion.div variants={hoverVariants}>
        <Link to={`/product/${product.id}`}>
          <div className="relative aspect-square overflow-hidden bg-gray-100 rounded-t-2xl">
            <motion.img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
            
            {/* Gradient overlay on hover */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
            
            {/* Quick action buttons */}
            <motion.div
              className="absolute top-4 right-4 flex flex-col space-y-2"
              initial={{ opacity: 0, x: 20 }}
              whileHover={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, staggerChildren: 0.1 }}
            >
              <motion.button
                onClick={(e) => {
                  e.preventDefault();
                  setIsLiked(!isLiked);
                }}
                className={`p-2 rounded-full backdrop-blur-md transition-all duration-300 ${
                  isLiked 
                    ? 'bg-red-500 text-white' 
                    : 'bg-white/80 text-gray-700 hover:bg-white'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
              </motion.button>
              
              <motion.button
                className="p-2 bg-white/80 text-gray-700 rounded-full backdrop-blur-md hover:bg-white transition-all duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Eye className="h-4 w-4" />
              </motion.button>
            </motion.div>
          </div>
        </Link>
        
        <div className="p-6">
          <Link to={`/product/${product.id}`}>
            <motion.h3 
              className="font-heading text-lg font-semibold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors"
              whileHover={{ x: 5 }}
              transition={{ duration: 0.2 }}
            >
              {product.name}
            </motion.h3>
          </Link>
          
          <p className="text-gray-600 text-sm mb-4 line-clamp-2 font-body">
            {product.description}
          </p>
          
          <div className="flex items-center justify-between mb-4">
            <motion.div 
              className="text-2xl font-bold text-navy-800"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.2 }}
            >
              ₹{product.price.toFixed(2)}
            </motion.div>
            
            {product.sizes.length > 0 && product.in_stock && (
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
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
            <motion.button
              onClick={handleAddToCart}
              disabled={isAdding || !selectedSize}
              className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 disabled:from-gray-300 disabled:to-gray-400 text-white py-3 px-4 rounded-lg font-heading font-medium transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ShoppingCart className="h-4 w-4" />
              <span>{isAdding ? 'Adding...' : 'Add to Cart'}</span>
            </motion.button>
          ) : (
            <div className="w-full bg-red-100 text-red-800 py-3 px-4 rounded-lg font-heading font-medium text-center border border-red-200">
              <div className="flex items-center justify-center space-x-2">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>Out of Stock</span>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}