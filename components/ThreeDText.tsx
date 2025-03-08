"use client"

import React, { useEffect, useState } from 'react';

interface ThreeDTextProps {
  text: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
  className?: string;
}

const ThreeDText: React.FC<ThreeDTextProps> = ({ 
  text, 
  size = 'md',
  className = '' 
}) => {
  const [isDark, setIsDark] = useState(false);
  
  useEffect(() => {
    // Check if we're in the browser
    if (typeof window !== 'undefined') {
      // Initial check
      setIsDark(document.documentElement.classList.contains('dark'));
      
      // Set up an observer to watch for theme changes
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.attributeName === 'class') {
            setIsDark(document.documentElement.classList.contains('dark'));
          }
        });
      });
      
      observer.observe(document.documentElement, { attributes: true });
      
      return () => observer.disconnect();
    }
  }, []);
  
  const sizeClasses = {
    sm: 'text-xl md:text-2xl',
    md: 'text-2xl md:text-3xl',
    lg: 'text-3xl md:text-4xl',
    xl: 'text-4xl md:text-5xl',
    '2xl': 'text-5xl md:text-6xl',
    '3xl': 'text-6xl md:text-7xl',
    '4xl': 'text-7xl md:text-8xl',
    '5xl': 'text-8xl md:text-9xl'
  };
  
  const textColorClass = isDark ? 'text-blue-300' : 'text-blue-600';
  const shadowColor = isDark ? 'rgba(79, 209, 255, 0.5)' : 'rgba(0, 102, 255, 0.5)';
  
  const textStyle = {
    fontFamily: '"Audiowide", "Orbitron", sans-serif',
    textShadow: `3px 3px 0 ${shadowColor}, 
                 -1px -1px 0 ${shadowColor}, 
                 1px -1px 0 ${shadowColor}, 
                 -1px 1px 0 ${shadowColor},
                 1px 1px 0 ${shadowColor}`,
    letterSpacing: '0.05em',
    fontWeight: 'bold',
    transform: 'perspective(500px) rotateX(10deg)',
    display: 'inline-block'
  };

  return (
    <span 
      className={`${sizeClasses[size]} ${textColorClass} ${className} transition-colors duration-300`} 
      style={textStyle}
    >
      {text}
    </span>
  );
};

export default ThreeDText; 