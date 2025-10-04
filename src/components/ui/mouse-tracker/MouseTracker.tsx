'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface MouseTrackerProps {
  children: React.ReactNode;
}

const MouseTracker: React.FC<MouseTrackerProps> = ({ children }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [cursorVariant, setCursorVariant] = useState('default');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };

    const mouseEnter = () => setIsHovering(true);
    const mouseLeave = () => setIsHovering(false);

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', mouseMove);
      container.addEventListener('mouseenter', mouseEnter);
      container.addEventListener('mouseleave', mouseLeave);
    }

    return () => {
      if (container) {
        container.removeEventListener('mousemove', mouseMove);
        container.removeEventListener('mouseenter', mouseEnter);
        container.removeEventListener('mouseleave', mouseLeave);
      }
    };
  }, []);

  const variants = {
    default: {
      x: mousePosition.x - 16,
      y: mousePosition.y - 16,
      scale: 1,
      opacity: isHovering ? 1 : 0,
    },
    hover: {
      x: mousePosition.x - 24,
      y: mousePosition.y - 24,
      scale: 1.5,
      opacity: 1,
    },
    click: {
      x: mousePosition.x - 32,
      y: mousePosition.y - 32,
      scale: 2,
      opacity: 0,
    },
  };

  const handleVariantChange = (variant: string) => {
    setCursorVariant(variant);
    setTimeout(() => setCursorVariant('default'), 300);
  };

  return (
    <div 
      ref={containerRef} 
      className="relative overflow-hidden"
      onMouseDown={() => handleVariantChange('click')}
    >
      {/* Custom Cursor */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full border-2 border-primary pointer-events-none z-50 mix-blend-difference"
        variants={variants}
        animate={cursorVariant}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 28,
        }}
      />

      {/* Mouse Trail Effect */}
      {isHovering && (
        <div className="fixed inset-0 pointer-events-none z-40">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-primary/20 rounded-full"
              style={{
                left: mousePosition.x,
                top: mousePosition.y,
              }}
              initial={{ scale: 0, opacity: 0.8 }}
              animate={{ 
                scale: [0, 1, 0], 
                opacity: [0.8, 0.4, 0],
                x: mousePosition.x + (Math.random() - 0.5) * 100,
                y: mousePosition.y + (Math.random() - 0.5) * 100,
              }}
              transition={{
                duration: 1,
                delay: i * 0.1,
                ease: 'easeOut',
              }}
            />
          ))}
        </div>
      )}

      {/* Spotlight Effect */}
      {isHovering && (
        <motion.div
          className="fixed inset-0 pointer-events-none z-30"
          style={{
            background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(191, 146, 74, 0.1) 0%, transparent 80%)`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}

      {/* Interactive Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-20">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Content with enhanced hover effects */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default MouseTracker;