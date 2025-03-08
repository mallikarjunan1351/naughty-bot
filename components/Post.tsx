"use client"

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { getRandomImageUrl } from '@/utils/imageUtils';
import CommentList from './CommentList';

interface PostProps {
  post: {
    id: string;
    content: string;
    title?: string;
    body?: string;
    createdAt: string;
    author: {
      id: string;
      name: string;
      image?: string;
    };
  };
}

const Post: React.FC<PostProps> = ({ post }) => {
  const [showComments, setShowComments] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('light');
  
  // Get theme from localStorage or system preference on component mount
  useEffect(() => {
    // Check if we're in the browser environment
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null;
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
      setTheme(initialTheme);
      
      // Listen for theme changes in the document
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.attributeName === 'class') {
            const isDark = document.documentElement.classList.contains('dark');
            setTheme(isDark ? 'dark' : 'light');
          }
        });
      });
      
      observer.observe(document.documentElement, { attributes: true });
      
      return () => {
        observer.disconnect();
      };
    }
  }, []);

  // Format date without using date-fns
  const formatPostDate = (dateString: string) => {
    const postDate = new Date(dateString);
    const now = new Date();
    
    const diffInSeconds = Math.floor((now.getTime() - postDate.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    } else {
      return postDate.toLocaleDateString();
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-colors duration-300">
      {/* Post header with user info */}
      <div className="p-4 flex items-center">
        <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
          {post.author.image ? (
            <Image 
              src={post.author.image} 
              alt={post.author.name || 'User'} 
              width={40} 
              height={40} 
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="w-full h-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
              <span className="text-sm font-bold text-gray-600 dark:text-gray-300">
                {post.author.name?.charAt(0) || 'U'}
              </span>
            </div>
          )}
        </div>
        <div>
          <h3 className="font-medium text-gray-900 dark:text-white">{post.author.name}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {formatPostDate(post.createdAt)}
          </p>
        </div>
      </div>
      
      {/* Post title */}
      {post.title && (
        <div className="px-4 pb-2">
          <h4 className="font-semibold text-lg text-gray-900 dark:text-white">{post.title}</h4>
        </div>
      )}
      
      {/* Post content */}
      <div className="px-4 pb-2">
        <p className="text-gray-800 dark:text-gray-200 whitespace-pre-line">{post.content}</p>
      </div>
      
      {/* Post image */}
      <div className="relative w-full h-64 mt-2">
        <Image 
          src={`https://picsum.photos/seed/${post.id}/800/600`} 
          alt="Post image" 
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      
      {/* Post actions */}
      <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex space-x-4">
        <button className="flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          Like
        </button>
        <button 
          className="flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
          onClick={() => setShowComments(!showComments)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          Comment
        </button>
        <button className="flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          Share
        </button>
      </div>
      
      {/* Comments section */}
      {showComments && (
        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
          <CommentList postId={parseInt(post.id)} theme={theme} />
        </div>
      )}
    </div>
  );
};

export default Post; 