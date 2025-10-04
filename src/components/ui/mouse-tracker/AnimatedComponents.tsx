'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({ 
  children, 
  className = '', 
  delay = 0,
  direction = 'up' 
}) => {
  const getInitialPosition = () => {
    switch (direction) {
      case 'up': return { y: 50 };
      case 'down': return { y: -50 };
      case 'left': return { x: 50 };
      case 'right': return { x: -50 };
      default: return { y: 50 };
    }
  };

  return (
    <motion.div
      className={className}
      initial={{ 
        opacity: 0, 
        ...getInitialPosition() 
      }}
      whileInView={{ 
        opacity: 1, 
        x: 0, 
        y: 0 
      }}
      viewport={{ once: true }}
      transition={{ 
        duration: 0.6, 
        delay,
        ease: 'easeOut' 
      }}
      whileHover={{ 
        y: -5,
        transition: { duration: 0.2 }
      }}
    >
      {children}
    </motion.div>
  );
};

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  className?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ 
  value, 
  duration = 2, 
  className = '' 
}) => {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.span
        initial={{ scale: 0.5 }}
        animate={{ scale: 1 }}
        transition={{ 
          type: 'spring', 
          stiffness: 260, 
          damping: 20,
          delay: 0.2
        }}
      >
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration }}
        >
          {value.toLocaleString()}
        </motion.span>
      </motion.span>
    </motion.div>
  );
};

interface AnimatedButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: 'default' | 'pulse' | 'bounce';
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({ 
  children, 
  className = '', 
  onClick,
  variant = 'default' 
}) => {
  const getAnimation = () => {
    switch (variant) {
      case 'pulse':
        return {
          scale: [1, 1.05, 1],
          transition: {
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          },
        };
      case 'bounce':
        return {
          y: [0, -10, 0],
          transition: {
            duration: 1,
            repeat: Infinity,
            ease: 'easeInOut',
          },
        };
      default:
        return {
          whileHover: { scale: 1.05 },
          whileTap: { scale: 0.95 },
        };
    }
  };

  return (
    <motion.button
      className={className}
      onClick={onClick}
      {...getAnimation()}
    >
      {children}
    </motion.button>
  );
};

interface AnimatedBackgroundProps {
  children: ReactNode;
  className?: string;
}

export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-xl"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, (Math.random() - 0.5) * 100, 0],
              y: [0, (Math.random() - 0.5) * 100, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Gradient Overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

interface StaggeredListProps {
  children: ReactNode[];
  className?: string;
  staggerDelay?: number;
}

export const StaggeredList: React.FC<StaggeredListProps> = ({ 
  children, 
  className = '', 
  staggerDelay = 0.1 
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {children.map((child, index) => (
        <motion.div key={index} variants={itemVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

interface ParallaxSectionProps {
  children: ReactNode;
  className?: string;
  speed?: number;
}

export const ParallaxSection: React.FC<ParallaxSectionProps> = ({ 
  children, 
  className = '', 
  speed = 0.5 
}) => {
  return (
    <motion.section
      className={`relative ${className}`}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23bf924a\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        }}
        initial={{ y: 0 }}
        whileInView={{ y: -50 * speed }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: 'easeOut' }}
      />
      <div className="relative z-10">
        {children}
      </div>
    </motion.section>
  );
};