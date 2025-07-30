import React from 'react';
import { motion } from 'framer-motion';

export default function FloatingElements() {
  const floatingVariants = {
    float: {
      y: [-20, 20, -20],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const elements = [
    { size: 60, delay: 0, x: '10%', y: '20%' },
    { size: 40, delay: 1, x: '85%', y: '15%' },
    { size: 80, delay: 2, x: '70%', y: '70%' },
    { size: 35, delay: 1.5, x: '15%', y: '80%' },
    { size: 50, delay: 0.5, x: '90%', y: '60%' },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {elements.map((element, index) => (
        <motion.div
          key={index}
          className="absolute opacity-10"
          style={{
            left: element.x,
            top: element.y,
            width: element.size,
            height: element.size,
          }}
          variants={floatingVariants}
          animate="float"
          transition={{ delay: element.delay }}
        >
          <div 
            className="w-full h-full rounded-full bg-gradient-to-br from-emerald-400 to-navy-600 blur-sm"
            style={{
              filter: 'blur(8px)',
            }}
          />
        </motion.div>
      ))}
    </div>
  );
}