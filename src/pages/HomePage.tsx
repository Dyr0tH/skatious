import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Star, Sparkles, Truck, Shield, Headphones, Award, Users, Heart, Quote } from 'lucide-react';
import Footer from '../components/Footer';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  sizes: string[];
  in_stock: boolean;
  image_url: string;
}

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { scrollY } = useScroll();
  const heroParallax = useTransform(scrollY, [0, 500], [0, -150]);

  useEffect(() => {
    // Mock products for demonstration
    setFeaturedProducts([
      {
        id: '1',
        name: 'Premium Cotton Tee',
        description: 'Soft, comfortable cotton t-shirt with modern fit',
        price: 29.99,
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        in_stock: true,
        image_url: 'https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg'
      },
      {
        id: '2',
        name: 'Urban Hoodie',
        description: 'Stylish hoodie perfect for casual wear and street style',
        price: 49.99,
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        in_stock: true,
        image_url: 'https://images.pexels.com/photos/1629781/pexels-photo-1629781.jpeg'
      },
      {
        id: '3',
        name: 'Classic Denim Jacket',
        description: 'Timeless denim jacket with modern styling',
        price: 79.99,
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        in_stock: true,
        image_url: 'https://images.pexels.com/photos/1010973/pexels-photo-1010973.jpeg'
      }
    ]);
    setLoading(false);
  }, []);

  const stats = [
    { value: '100+', label: 'Happy Customers', description: 'Fashion enthusiasts worldwide' },
    { value: '1000+', label: 'Products Sold', description: 'Premium pieces delivered' },
    { value: '4/5', label: 'Customer Rating', description: 'Average satisfaction score' },
    { value: '75%', label: 'Recurring Customers', description: 'Come back for more' }
  ];

  const features = [
    {
      icon: Truck,
      title: 'Free Global Shipping',
      description: 'Complimentary worldwide delivery on orders over $100.'
    },
    {
      icon: Shield,
      title: 'Premium Quality',
      description: 'Every piece crafted with finest materials and quality promise.'
    },
    {
      icon: Headphones,
      title: '24/7 Support',
      description: 'Our fashion experts are here to help you anytime.'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Fashion Enthusiast',
      content: 'SKATIOUS has completely transformed my wardrobe. The quality is exceptional.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b1a1?w=100&h=100&fit=crop&crop=face'
    },
    {
      name: 'Michael Chen',
      role: 'Style Blogger',
      content: 'The attention to detail in every piece is remarkable. Premium quality always.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
    },
    {
      name: 'Emma Davis',
      role: 'Creative Director',
      content: 'Finally found a brand that understands modern fashion. Highly recommended!',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <motion.div 
          style={{ y: heroParallax }}
          className="absolute inset-0 bg-gradient-to-br from-navy-900 via-navy-800 to-emerald-900"
        />
        
        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-20 h-20 bg-emerald-400/10 rounded-full blur-xl"
              animate={{
                y: [-20, 20, -20],
                x: [-10, 10, -10],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.5
              }}
              style={{
                left: `${20 + i * 15}%`,
                top: `${10 + i * 15}%`,
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 text-center text-white px-4 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-6"
          >
            <div className="flex items-center justify-center mb-4">
              <Sparkles className="h-6 w-6 text-emerald-400 mr-2" />
              <span className="text-emerald-400 font-semibold tracking-wide uppercase text-sm">
                Premium Collection
              </span>
              <Sparkles className="h-6 w-6 text-emerald-400 ml-2" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold mb-8 leading-tight"
          >
            Elevate Your
            <span className="block text-emerald-400">Style Experience</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Discover premium clothing crafted for those who demand excellence, style, and comfort in every piece.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-6 justify-center mb-16"
          >
            <Link
              to="/products"
              className="group bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 flex items-center justify-center space-x-2 transform hover:scale-105 shadow-2xl"
            >
              <span>Shop Collection</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/about"
              className="border-2 border-white/80 text-white hover:bg-white/10 px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 backdrop-blur-sm transform hover:scale-105"
            >
              Learn More
            </Link>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex items-center justify-center space-x-8 text-gray-300"
          >
            <div className="flex items-center space-x-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <span>50K+ Reviews</span>
            </div>
            <div className="hidden sm:block w-1 h-6 bg-gray-400 rounded-full" />
            <span>Free Global Shipping</span>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-navy-900 mb-6">
              Why Choose SKATIOUS?
            </h2>
            <div className="w-24 h-1 bg-emerald-600 mx-auto mb-6 rounded-full" />
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're not just selling clothes; we're crafting experiences that elevate your style journey.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 text-center group"
              >
                <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-emerald-200 transition-colors">
                  <feature.icon className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold text-navy-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-navy-900 mb-6">
              Hot Selling Products
            </h2>
            <div className="w-24 h-1 bg-emerald-600 mx-auto mb-6 rounded-full" />
            <p className="text-xl text-gray-600">
              Discover our most popular and fast selling clothing pieces.
            </p>
          </motion.div>
          
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-gray-200 animate-pulse rounded-2xl h-96" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {featuredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group"
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-semibold text-lg text-navy-900 mb-2">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-4">{product.description}</p>
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-2xl font-bold text-navy-800">
                        ₹{product.price.toFixed(2)}
                      </div>
                    </div>
                    <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-200">
                      Add to Cart
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-center"
          >
            <Link
              to="/products"
              className="inline-flex items-center space-x-2 bg-navy-800 hover:bg-navy-900 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors duration-200 transform hover:scale-105"
            >
              <span>View All Products</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-navy-900 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute top-20 left-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [360, 180, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute bottom-20 right-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Trusted by Fashion Lovers
            </h2>
            <div className="w-24 h-1 bg-emerald-400 mx-auto mb-6 rounded-full" />
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Numbers that speak for themselves. Join our satisfied customers who love SKATIOUS.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
                className="text-center bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300"
              >
                <div className="text-4xl font-bold text-emerald-400 mb-2">{stat.value}</div>
                <h3 className="text-xl font-semibold text-white mb-2">{stat.label}</h3>
                <p className="text-gray-400">{stat.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-navy-900 mb-6">
              What Our Customers Say
            </h2>
            <div className="w-24 h-1 bg-emerald-600 mx-auto mb-6 rounded-full" />
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Don't just take our word for it. Here's what fashion lovers are saying about SKATIOUS.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 relative"
              >
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-emerald-600 rounded-xl shadow-lg flex items-center justify-center">
                  <Quote className="h-6 w-6 text-white" />
                </div>

                <div className="flex items-center mb-4 ml-8">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>

                <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                  "{testimonial.content}"
                </p>

                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-emerald-200 mr-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-navy-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-24 bg-gradient-to-r from-emerald-600 to-emerald-700 relative overflow-hidden">
        {/* Background Effects */}
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"
        />
        <motion.div
          animate={{
            rotate: -360,
            scale: [1.2, 1, 1.2],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-10 right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"
        />

        <div className="max-w-4xl mx-auto px-4 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Stay in the Loop
            </h2>
            <p className="text-emerald-100 text-xl mb-12 max-w-2xl mx-auto">
              Get the latest updates on new collections, exclusive deals, and style tips directly to your inbox.
            </p>
            
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
            >
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 rounded-2xl border-2 border-emerald-400/30 focus:ring-4 focus:ring-white/20 focus:border-white bg-white/10 backdrop-blur-sm text-white placeholder-emerald-200 text-lg"
              />
              <button
                type="submit"
                className="bg-white text-emerald-600 px-8 py-4 rounded-2xl font-semibold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105"
              >
                Subscribe
              </button>
            </motion.form>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}