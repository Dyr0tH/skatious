import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Fashion Enthusiast',
    content: 'SKATIOUS has completely transformed my wardrobe. The quality is exceptional and the style is exactly what I was looking for.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b1a1?w=100&h=100&fit=crop&crop=face'
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Style Blogger',
    content: 'The attention to detail in every piece is remarkable. I love how each item feels premium and fits perfectly.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
  },
  {
    id: 3,
    name: 'Emma Davis',
    role: 'Creative Director',
    content: 'Finally found a brand that understands modern fashion. The designs are contemporary yet timeless.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
  }
];

export default function TestimonialsSection() {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
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
        ease: [0.21, 1.02, 0.73, 1]
      }
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-emerald-50/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-emerald-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-navy-200/20 rounded-full blur-3xl" />
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
            What Our Customers Say
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-emerald-600 mx-auto mb-6 rounded-full" />
          <p className="font-body text-xl text-gray-600 max-w-3xl mx-auto">
            Don't just take our word for it. Here's what fashion lovers are saying about SKATIOUS.
          </p>
        </motion.div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              variants={itemVariants}
              whileHover={{ 
                y: -8, 
                scale: 1.02,
                transition: { duration: 0.3 }
              }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 relative group"
            >
              {/* Quote icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 + 0.5, duration: 0.5 }}
                className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
              >
                <Quote className="h-6 w-6 text-white" />
              </motion.div>

              {/* Rating stars */}
              <div className="flex items-center mb-4 ml-8">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 + 0.7 + i * 0.1 }}
                  >
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  </motion.div>
                ))}
              </div>

              {/* Content */}
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 + 0.8, duration: 0.6 }}
                className="font-body text-gray-700 mb-6 text-lg leading-relaxed"
              >
                "{testimonial.content}"
              </motion.p>

              {/* Author */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 + 1, duration: 0.5 }}
                className="flex items-center"
              >
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-emerald-200 mr-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-heading font-semibold text-navy-900">
                    {testimonial.name}
                  </h4>
                  <p className="font-body text-sm text-gray-600">
                    {testimonial.role}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}