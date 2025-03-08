"use client"

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
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
  const [likeCount, setLikeCount] = useState(Math.floor(Math.random() * 50) + 5);
  const [commentCount, setCommentCount] = useState(Math.floor(Math.random() * 20) + 1);
  const [shareCount, setShareCount] = useState(Math.floor(Math.random() * 10));
  const [isLiked, setIsLiked] = useState(false);
  
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
      return 'now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes}m`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours}h`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days}d`;
    } else {
      return postDate.toLocaleDateString();
    }
  };

  const handleLike = () => {
    if (isLiked) {
      setLikeCount(likeCount - 1);
    } else {
      setLikeCount(likeCount + 1);
    }
    setIsLiked(!isLiked);
  };

  const handleComment = () => {
    setShowComments(!showComments);
    if (!showComments) {
      setCommentCount(commentCount + 1);
    }
  };

  const handleShare = () => {
    setShareCount(shareCount + 1);
  };

  return (
    <div className="backdrop-blur-sm bg-white/30 dark:bg-gray-800/40 rounded-xl shadow-lg overflow-hidden border border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 hover:shadow-xl">
      {/* Post header with user info */}
      <div className="p-4 flex items-center">
        <div className="w-10 h-10 rounded-full overflow-hidden mr-3 ring-2 ring-blue-500/30">
          {post.author.image ? (
            <Image 
              src={post.author.image} 
              alt={post.author.name || 'User'} 
              width={40} 
              height={40} 
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
              <span className="text-sm font-bold text-white">
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
      
      {/* Post image */}
      <div className="relative w-full h-64 mt-2">
        <Image 
          src={`https://picsum.photos/seed/${post.id}/800/600`} 
          alt="Post image" 
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
        />
      </div>

        {/* Post content */}
      <div className="px-4 py-2">
        {post.title && (
          <h4 className="font-normal text-sm text-gray-600 dark:text-white">{post.title}</h4>
        )}
      </div>
      
      {/* Post actions */}
      <div className="px-4 py-3 border-t border-gray-200/50 dark:border-gray-700/50 flex justify-between">
        <motion.button 
          className={`flex items-center ${
            isLiked 
              ? 'text-blue-500 dark:text-blue-400' 
              : 'text-gray-600 dark:text-gray-300'
          } hover:text-blue-500 dark:hover:text-blue-400 transition-colors`}
          onClick={handleLike}
          whileTap={{ scale: 1.2 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill={isLiked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isLiked ? 0 : 2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <span>{likeCount}</span>
        </motion.button>
        
        <motion.button 
          className="flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
          onClick={handleComment}
          whileTap={{ scale: 1.2 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span>{commentCount}</span>
        </motion.button>
        
        <motion.button 
          className="flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
          onClick={handleShare}
          whileTap={{ scale: 1.2 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          <span>{shareCount}</span>
        </motion.button>
      </div>
      
      {/* Comments section */}
      {showComments && (
        <motion.div 
          className="px-4 py-3 border-t border-gray-200/50 dark:border-gray-700/50"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
        >
          <CommentList postId={parseInt(post.id)} theme={theme} />
        </motion.div>
      )}
    </div>
  );
};

export default Post; 