"use client"

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md transition-colors duration-300 ${className}`}>
      {children}
    </div>
  );
};

export default Card; 