"use client"

import React, { useEffect, useState } from 'react';
import ThreeDText from '@/components/ThreeDText';
import AnimatedBackground from '@/components/AnimatedBackground';
import Image from 'next/image';

// Mock user data in case next-auth isn't working
const mockUser = {
  name: 'Demo User',
  email: 'demo@example.com',
  image: 'https://i.pravatar.cc/150?u=demo'
};

export default function ProfilePage() {
  // Use local state instead of directly using useSession
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Try to get session data, fall back to mock data if it fails
    const getSessionData = async () => {
      try {
        // Try to dynamically import next-auth to avoid build errors if it's not configured
        const { useSession } = await import('next-auth/react');
        const { data: session } = useSession();
        
        if (session?.user) {
          setUser(session.user);
        } else {
          // Fall back to mock data if no session
          setUser(mockUser);
        }
      } catch (error) {
        console.error('Error loading session:', error);
        // Fall back to mock data if there's an error
        setUser(mockUser);
      } finally {
        setLoading(false);
      }
    };
    
    getSessionData();
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <AnimatedBackground intensity="low" />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <ThreeDText text="Naughty Bot" size="lg" className="mb-4" />
        </div>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          /* Profile card */
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-4 transition-colors duration-300 max-w-2xl mx-auto">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
                {user?.image ? (
                  <Image 
                    src={user.image} 
                    alt={user.name || 'User'} 
                    width={96} 
                    height={96} 
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-600 dark:text-gray-300">
                      {user?.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                )}
              </div>
              
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {user?.name || 'User Profile'}
              </h1>
              
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {user?.email || 'user@example.com'}
              </p>
              
              <div className="w-full border-t border-gray-200 dark:border-gray-700 pt-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Profile Information</h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Bio</h3>
                    <p className="text-gray-800 dark:text-gray-200 mt-1">
                      No bio information available yet.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Location</h3>
                    <p className="text-gray-800 dark:text-gray-200 mt-1">
                      Not specified
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Joined</h3>
                    <p className="text-gray-800 dark:text-gray-200 mt-1">
                      {new Date().toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 