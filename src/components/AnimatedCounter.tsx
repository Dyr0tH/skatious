import React from 'react';
import { useInView } from 'react-intersection-observer';
import { motion, useAnimation, useMotionValue, useTransform } from 'framer-motion';

interface AnimatedCounterProps {
  end: number;
  duration?: number;
  suffix?: string;
  className?: string;
}

export default function AnimatedCounter({ end, duration = 2, suffix = '', className = '' }: AnimatedCounterProps) {
  const controls = useAnimation();
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  React.useEffect(() => {
    if (inView) {
      controls.start({
        scale: [1, 1.1, 1],
        transition: { duration: 0.5, ease: "easeOut" }
      });
      
      count.set(0);
      const interval = setInterval(() => {
        count.set(count.get() + end / (duration * 60));
        if (count.get() >= end) {
          count.set(end);
          clearInterval(interval);
        }
      }, 1000 / 60);

      return () => clearInterval(interval);
    }
  }, [inView, controls, count, end, duration]);

  return (
    <motion.div
      ref={ref}
      animate={controls}
      className={className}
    >
      <motion.span className="text-4xl font-bold text-emerald-600">
        {rounded}
        {suffix}
      </motion.span>
    </motion.div>
  );
}