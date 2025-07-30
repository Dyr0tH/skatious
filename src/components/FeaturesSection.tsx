import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Truck, Shield, Headphones, Sparkles, Recycle, Globe } from 'lucide-react';

const features = [
  {
    icon: Truck,
    title: 'Free Global Shipping',
    description: 'Complimentary worldwide delivery on orders over $100. Fast, secure, and trackable.',
    color: 'from-blue-500 to-blue-600',
    delay: 0
  },
  {
    icon: Shield,
    title: 'Premium Quality Guarantee',
    description: 'Every piece is crafted with the finest materials and backed by our quality promise.',
    color: 'from-emerald-500 to-emerald-600',
    delay: 0.1
  },
  {
    icon: Headphones,
    title: '24/7 Style Support',
    description: 'Our fashion experts are here to help you find the perfect style, anytime.',
    color: 'from-purple-500 to-purple-600',
    delay: 0.2
  },
  {
    icon: Sparkles,
    title: 'Exclusive Collections',
    description: 'Access limited edition pieces and designer collaborations before anyone else.',
    color: 'from-yellow-500 to-orange-500',
    delay: 0.3
  },
  {
    icon: Recycle,
    title: 'Sustainable Fashion',
    description: 'Ethically sourced materials and eco-friendly production for a better tomorrow.',
    color: 'from-green-500 to-green-600',
    delay: 0.4
  },
  {
    icon: Globe,
    title: 'Global Community',
    description: 'Join thousands of fashion enthusiasts sharing styles and trends worldwide.',
    color: 'from-red-500 to-pink-500',
    delay: 0.5
  }
];

export default function FeaturesSection() {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 60,
      rotateX: -15
    },
    visible: { 
      opacity: 1, 
      y: 0,
      rotateX: 0,
      transition: {
        duration: 0.8,
        ease: [0.21, 1.02, 0.73, 1]
      }
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-white via-gray-50 to-emerald-50/20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-20 right-20 w-64 h-64 bg-emerald-100 rounded-full blur-3xl opacity-30"
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
          className="absolute bottom-20 left-20 w-80 h-80 bg-navy-100 rounded-full blur-3xl opacity-30"
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
            Why Choose SKATIOUS?
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-emerald-600 mx-auto mb-6 rounded-full" />
          <p className="font-body text-xl text-gray-600 max-w-3xl mx-auto">
            We're not just selling clothes; we're crafting experiences that elevate your style journey.
          </p>
        </motion.div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ 
                y: -12,
                scale: 1.03,
                rotateX: 5,
                transition: { duration: 0.3 }
              }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 group relative overflow-hidden"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Animated background gradient */}
              <motion.div
                className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-2xl`}
                initial={{ scale: 0 }}
                whileHover={{ scale: 1 }}
                transition={{ duration: 0.5 }}
              />

              {/* Icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ delay: feature.delay + 0.3, duration: 0.6 }}
                className={`w-16 h-16 mb-6 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}
              >
                <feature.icon className="h-8 w-8 text-white" />
              </motion.div>

              {/* Title */}
              <motion.h3
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: feature.delay + 0.5, duration: 0.5 }}
                className="font-heading text-xl font-semibold text-navy-900 mb-4 group-hover:text-emerald-600 transition-colors duration-300"
              >
                {feature.title}
              </motion.h3>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: feature.delay + 0.7, duration: 0.5 }}
                className="font-body text-gray-600 leading-relaxed"
              >
                {feature.description}
              </motion.p>

              {/* Hover effect indicator */}
              <motion.div
                className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-emerald-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-b-2xl"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}