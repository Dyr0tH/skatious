import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Users, ShoppingBag, Award, Heart } from 'lucide-react';
import AnimatedCounter from './AnimatedCounter';

const stats = [
  {
    icon: Users,
    value: 50000,
    suffix: '+',
    label: 'Happy Customers',
    description: 'Fashion lovers worldwide',
    color: 'from-blue-500 to-blue-600'
  },
  {
    icon: ShoppingBag,
    value: 100000,
    suffix: '+',
    label: 'Products Sold',
    description: 'Premium pieces delivered',
    color: 'from-emerald-500 to-emerald-600'
  },
  {
    icon: Award,
    value: 5,
    suffix: '/5',
    label: 'Customer Rating',
    description: 'Average satisfaction score',
    color: 'from-yellow-500 to-orange-500'
  },
  {
    icon: Heart,
    value: 98,
    suffix: '%',
    label: 'Repeat Customers',
    description: 'Come back for more',
    color: 'from-red-500 to-pink-500'
  }
];

export default function StatsSection() {
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 60,
      scale: 0.8
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.21, 1.02, 0.73, 1]
      }
    }
  };

  return (
    <section className="py-20 bg-navy-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10">
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            rotate: -360,
            scale: [1.2, 1, 1.2],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-3xl"
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
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-white mb-6">
            Trusted by Fashion Lovers
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-emerald-400 to-blue-400 mx-auto mb-6 rounded-full" />
          <p className="font-body text-xl text-gray-300 max-w-3xl mx-auto">
            Numbers that speak for themselves. Join thousands of satisfied customers who love SKATIOUS.
          </p>
        </motion.div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.05,
                y: -10,
                transition: { duration: 0.3 }
              }}
              className="text-center bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-500 group"
            >
              {/* Icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 + 0.3, duration: 0.6 }}
                className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-r ${stat.color} flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}
              >
                <stat.icon className="h-8 w-8 text-white" />
              </motion.div>

              {/* Counter */}
              <div className="mb-2">
                {inView && (
                  <AnimatedCounter
                    end={stat.value}
                    suffix={stat.suffix}
                    className="text-4xl font-bold text-white"
                  />
                )}
              </div>

              {/* Label */}
              <motion.h3
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 + 0.8, duration: 0.5 }}
                className="font-heading text-xl font-semibold text-white mb-2"
              >
                {stat.label}
              </motion.h3>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 + 1, duration: 0.5 }}
                className="font-body text-gray-400"
              >
                {stat.description}
              </motion.p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}