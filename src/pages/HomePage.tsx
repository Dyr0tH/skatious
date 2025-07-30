import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Star, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Footer from '../components/Footer';
import TeamsAndPlayerse from '../components/PlayersShowcase';
import PremiumProductCard from '../components/PremiumProductCard';
import TestimonialsSection from '../components/TestimonialsSection';
import StatsSection from '../components/StatsSection';
import FeaturesSection from '../components/FeaturesSection';
import FloatingElements from '../components/FloatingElements';
import MagneticButton from '../components/MagneticButton';
import ParallaxSection from '../components/ParallaxSection';

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
  const heroY = useTransform(scrollY, [0, 500], [0, -250]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);

  useEffect(() => {
    loadFeaturedProducts();
  }, []);

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
          in_stock,
          product_images!inner (
            image_url,
            order_index
          )
        `)
        .limit(6);

      if (products) {
        const formattedProducts = products.map(product => ({
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          sizes: product.sizes,
          in_stock: product.in_stock,
          image_url: product.product_images[0]?.image_url || 'https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg',
        }));
        setFeaturedProducts(formattedProducts);
      }
    } catch (error) {
      console.error('Error loading featured products:', error);
      // Mock data for demonstration
      setFeaturedProducts([
        {
          id: '1',
          name: 'Premium Cotton Tee',
          description: 'Soft, comfortable cotton t-shirt with modern fit',
          price: 29.99,
          sizes: ['XS', 'S', 'M', 'L', 'XL'],
          in_stock: false,
          image_url: 'https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg'
        },
        {
          id: '2',
          name: 'Urban Hoodie',
          description: 'Stylish hoodie perfect for casual wear and street style',
          price: 49.99,
          sizes: ['S', 'M', 'L', 'XL', 'XXL'],
          in_stock: false,
          image_url: 'https://images.pexels.com/photos/1629781/pexels-photo-1629781.jpeg'
        },
        {
          id: '3',
          name: 'Classic Denim Jacket',
          description: 'Timeless denim jacket with modern styling',
          price: 79.99,
          sizes: ['XS', 'S', 'M', 'L', 'XL'],
          in_stock: false,
          image_url: 'https://images.pexels.com/photos/1010973/pexels-photo-1010973.jpeg'
        }
      ]);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Enhanced Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center text-white overflow-hidden">
        {/* Parallax Background */}
        <motion.div 
          style={{ y: heroY, opacity: heroOpacity }}
          className="absolute inset-0"
        >
          {/* Animated Glassmorphic Gradient Background */}
          <div className="hero-animated-gradient" />
          <div className="absolute inset-0 z-1 backdrop-blur-xl bg-white/5" />
          
          {/* Premium fabric image as background */}
          <div 
            className="absolute inset-0 opacity-20 bg-cover bg-center mix-blend-soft-light"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1610049199961-3cd0223834ef?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwY2xvdGhpbmd8ZW58MHx8fHwxNzUzODg5OTg0fDA&ixlib=rb-4.1.0&q=85)'
            }}
          />
        </motion.div>

        {/* Floating Elements */}
        <FloatingElements />

        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-black/60 z-[2]" />
        
        <div className="relative z-[3] w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 text-center">
            {/* Animated Title */}
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1, ease: [0.21, 1.02, 0.73, 1] }}
            >
              <motion.div
                className="flex items-center justify-center mb-6"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                <Sparkles className="h-8 w-8 text-emerald-400 mr-3" />
                <span className="text-emerald-400 font-heading text-lg font-medium tracking-wide">
                  PREMIUM COLLECTION
                </span>
                <Sparkles className="h-8 w-8 text-emerald-400 ml-3" />
              </motion.div>

              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
                <motion.span
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                >
                  Elevate Your
                </motion.span>
                <motion.span 
                  className="text-emerald-400 block"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1, duration: 0.8 }}
                >
                  Style Experience
                </motion.span>
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="font-body text-xl sm:text-2xl text-gray-200 mb-12 max-w-4xl mx-auto leading-relaxed"
            >
              Discover premium clothing crafted for those who demand excellence, style, and comfort in every piece. 
              Where luxury meets affordability.
            </motion.p>

            {/* Enhanced CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-6 justify-center"
            >
              <MagneticButton
                onClick={() => window.location.href = '/products'}
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-10 py-4 rounded-2xl font-heading font-semibold text-lg shadow-2xl border-2 border-emerald-300/40 backdrop-blur-xl"
                intensity={0.4}
              >
                <span className="flex items-center space-x-3">
                  <span>Shop Collection</span>
                  <ArrowRight className="h-6 w-6" />
                </span>
              </MagneticButton>

              <MagneticButton
                onClick={() => window.location.href = '/about'}
                className="border-2 border-white/80 text-white hover:bg-white/20 px-10 py-4 rounded-2xl font-heading font-semibold text-lg backdrop-blur-xl bg-white/10 shadow-2xl"
                intensity={0.3}
              >
                Learn More
              </MagneticButton>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8, duration: 0.6 }}
              className="flex items-center justify-center space-x-8 mt-16 text-gray-300"
            >
              <div className="flex items-center space-x-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 2 + i * 0.1, duration: 0.3 }}
                    >
                      <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    </motion.div>
                  ))}
                </div>
                <span className="font-heading text-lg">50K+ Reviews</span>
              </div>
              <div className="hidden sm:block w-1 h-6 bg-gray-400 rounded-full" />
              <span className="font-heading text-lg">Free Global Shipping</span>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-[3]"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-3 bg-white/70 rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Teams and Players Section with Parallax */}
      <ParallaxSection speed={0.3}>
        <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
          <TeamsAndPlayerse />
        </section>
      </ParallaxSection>

      {/* Enhanced Features Section */}
      <FeaturesSection />

      {/* Enhanced Featured Products */}
      <ParallaxSection speed={0.2}>
        <section className="py-20 bg-gradient-to-br from-white via-emerald-50/30 to-gray-50 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 360],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute top-20 right-20 w-64 h-64 bg-emerald-100 rounded-full blur-3xl opacity-30"
            />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="font-display text-4xl lg:text-5xl font-bold text-navy-900 mb-6">
                Hot Selling Products
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-emerald-600 mx-auto mb-6 rounded-full" />
              <p className="font-body text-xl text-gray-600 max-w-3xl mx-auto">
                Discover our most popular and fast selling clothing pieces, loved by fashion enthusiasts worldwide.
              </p>
            </motion.div>
            
            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    className="bg-gray-200 animate-pulse rounded-2xl h-96"
                  />
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredProducts.slice(0, 3).map((product, index) => (
                  <PremiumProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            )}
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-center mt-16"
            >
              <MagneticButton
                onClick={() => window.location.href = '/products'}
                className="bg-gradient-to-r from-navy-800 to-navy-900 hover:from-navy-900 hover:to-black text-white px-10 py-4 rounded-2xl font-heading font-semibold text-lg shadow-2xl"
                intensity={0.3}
              >
                <span className="flex items-center space-x-3">
                  <span>View All Products</span>
                  <ArrowRight className="h-6 w-6" />
                </span>
              </MagneticButton>
            </motion.div>
          </div>
        </section>
      </ParallaxSection>

      {/* Stats Section */}
      <StatsSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Enhanced Newsletter Section */}
      <ParallaxSection speed={0.1}>
        <section className="py-20 bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-800 relative overflow-hidden">
          {/* Background elements */}
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

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="font-display text-4xl lg:text-5xl font-bold text-white mb-6">
                Stay in the Loop
              </h2>
              <p className="font-body text-emerald-100 text-xl mb-12 max-w-2xl mx-auto">
                Get the latest updates on new collections, exclusive deals, and style tips directly to your inbox.
              </p>
              
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
              >
                <motion.input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-6 py-4 rounded-2xl border-2 border-emerald-400/30 focus:ring-4 focus:ring-white/20 focus:border-white bg-white/10 backdrop-blur-sm text-white placeholder-emerald-200 font-body text-lg"
                  whileFocus={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                />
                <MagneticButton
                  className="bg-white text-emerald-600 px-8 py-4 rounded-2xl font-heading font-semibold text-lg shadow-2xl hover:shadow-3xl"
                  intensity={0.2}
                >
                  Subscribe
                </MagneticButton>
              </motion.form>
            </motion.div>
          </div>
        </section>
      </ParallaxSection>

      <Footer />
    </div>
  );
}