'use client';

import React from 'react';

interface LoaderProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
}

export function Loader({ size = 'medium', color = 'blue-600' }: LoaderProps) {
  const sizeClasses = {
    small: 'w-5 h-5',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
  };

  return (
    <div className="flex items-center justify-center">
      <div className={`animate-spin rounded-full border-t-2 border-b-2 border-${color} ${sizeClasses[size]}`}></div>
    </div>
  );
}

export function LoaderWithText({ size = 'medium', color = 'blue-600', text = 'Loading...' }: LoaderProps & { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <Loader size={size} color={color} />
      <p className="text-sm text-gray-500">{text}</p>
    </div>
  );
}

export function FullPageLoader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 border-t-4 border-b-4 border-blue-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-lg font-medium text-gray-700">Loading...</p>
      </div>
    </div>
  );
}

export function PulseLoader() {
  return (
    <div className="flex space-x-2">
      <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
      <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse delay-75"></div>
      <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse delay-150"></div>
    </div>
  );
}

export function SkeletonLoader() {
  return (
    <div className="space-y-4 w-full">
      <div className="h-12 bg-gray-200 rounded-md animate-pulse"></div>
      <div className="h-32 bg-gray-200 rounded-md animate-pulse"></div>
      <div className="h-12 bg-gray-200 rounded-md animate-pulse"></div>
      <div className="h-32 bg-gray-200 rounded-md animate-pulse"></div>
    </div>
  );
} 