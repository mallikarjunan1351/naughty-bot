"use client"

import React from 'react';
import Image from 'next/image';

interface User {
  id: string;
  name: string;
  email?: string;
  image?: string;
}

interface UserScrollerProps {
  users: User[];
  onSelectUser: (userId: string | null) => void;
  selectedUserId: string | null;
}

export default function UserScroller({ users, onSelectUser, selectedUserId }: UserScrollerProps) {
  return (
    <div className="w-full py-4 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="overflow-x-auto no-scrollbar">
          <div className="ml-2 flex space-x-6 py-2 min-w-max">
            {/* All Users option */}
            <div 
              className="flex flex-col items-center cursor-pointer"
              onClick={() => onSelectUser(null)}
            >
              <div 
                className={`relative w-16 h-16 rounded-full overflow-hidden mb-2 ${
                  selectedUserId === null 
                    ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-900' 
                    : ''
                }`}
              >
                <div className="w-full h-full flex items-center justify-center">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-8 w-8 text-gray-500 dark:text-gray-400" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" 
                    />
                  </svg>
                </div>
              </div>
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate max-w-[80px] text-center">
                All Users
              </span>
            </div>
            
            {/* Individual users */}
            {users.map((user, index) => (
              <div 
                key={user.id} 
                className="flex flex-col items-center cursor-pointer"
                onClick={() => onSelectUser(user.id)}
              >
                <div 
                  className={`relative w-16 h-16 rounded-full overflow-hidden mb-2 ${
                    selectedUserId === user.id 
                      ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-900' 
                      : ''
                  }`}
                >
                  {user.image ? (
                    <Image 
                      src={user.image} 
                      alt={user.name} 
                      fill
                      sizes="64px"
                      priority={index < 5}
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-lg font-bold text-gray-700 dark:text-gray-300">
                        {user.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate max-w-[80px] text-center">
                  {user.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 