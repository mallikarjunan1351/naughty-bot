"use client"

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../lib/store/store';
import { fetchPosts } from '../../lib/store/slices/postsSlice';
import { fetchComments } from '../../lib/store/slices/commentsSlice';
import { fetchUsers } from '../../lib/store/slices/usersSlice';
import Navbar from '../../components/Navbar';
import PostList from '../../components/PostList';
import { FullPageLoader, SkeletonLoader } from '../../components/ui/Loader';
import AnimatedBackground from '../../components/AnimatedBackground';
import ThreeDText from '@/components/ThreeDText';
import UserScroller from '@/components/UserScroller';
import Post from '@/components/Post';

// Define types
interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
}

interface Post {
  id: string;
  content: string;
  title: string;
  body: string;
  createdAt: string;
  author: {
    id: string;
    name: string;
    image?: string;
  };
}

export default function FeedPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [theme, setTheme] = useState<'dark' | 'light'>('light');
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  const { posts: reduxPosts, status: postsStatus } = useSelector((state: RootState) => state.posts);
  const { comments, status: commentsStatus } = useSelector((state: RootState) => state.comments);
  const { users: reduxUsers, status: usersStatus } = useSelector((state: RootState) => state.users);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      dispatch(fetchPosts());
      dispatch(fetchComments());
      dispatch(fetchUsers());
    }
  }, [dispatch, status]);

  // Apply theme from localStorage on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', initialTheme === 'dark');
    setTheme(initialTheme);
  }, []);

  // Fetch all users from JSONPlaceholder
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        if (response.ok) {
          const data = await response.json();
          // Transform the data to match our User interface
          const transformedUsers = data.map((user: any) => ({
            id: user.id.toString(),
            name: user.name,
            email: user.email,
            // Generate a random avatar
            image: `https://i.pravatar.cc/150?u=${user.id}`
          }));
          setUsers(transformedUsers);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    
    fetchUsers();
  }, []);

  // Fetch posts from JSONPlaceholder
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        // If a user is selected, filter posts by user ID
        const url = selectedUserId 
          ? `https://jsonplaceholder.typicode.com/posts?userId=${selectedUserId}` 
          : 'https://jsonplaceholder.typicode.com/posts';
        
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          
          // Get only the first 10 posts to avoid overwhelming the UI
          const limitedData = data.slice(0, 10);
          
          // Transform the data to match our Post interface
          const transformedPosts = await Promise.all(limitedData.map(async (post: any) => {
            // Fetch the user for this post
            const userResponse = await fetch(`https://jsonplaceholder.typicode.com/users/${post.userId}`);
            const userData = await userResponse.json();
            
            return {
              id: post.id.toString(),
              title: post.title,
              content: post.body,
              body: post.body,
              // Create a random date within the last month
              createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
              author: {
                id: userData.id.toString(),
                name: userData.name,
                image: `https://i.pravatar.cc/150?u=${userData.id}`
              }
            };
          }));
          
          setPosts(transformedPosts);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPosts();
  }, [selectedUserId]);

  const handleSelectUser = (userId: string | null) => {
    setSelectedUserId(userId);
  };

  if (status === 'loading') {
    return <FullPageLoader />;
  }

  if (!session) {
    return null;
  }

  const isLoading = 
    postsStatus === 'loading' || 
    commentsStatus === 'loading' || 
    usersStatus === 'loading';

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      {/* Animated background with reduced opacity */}
      <div className="fixed inset-0 z-0">
        <AnimatedBackground theme={theme} />
      </div>
      
      {/* Content with higher z-index */}
      <div className="relative z-10 min-h-screen">
        <Navbar />
        
        {/* New horizontal user scroller */}
        <UserScroller 
          users={users} 
          onSelectUser={handleSelectUser} 
          selectedUserId={selectedUserId} 
        />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="container mx-auto">
            {isLoading ? (
              <div className="space-y-6">
                <SkeletonLoader />
              </div>
            ) : (
              <div className="container mx-auto px-4 pb-8">
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {posts.map((post) => (
                      <Post key={post.id} post={post} />
                    ))}
                    
                    {posts.length === 0 && (
                      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center transition-colors duration-300">
                        <p className="text-gray-600 dark:text-gray-300">
                          {selectedUserId ? 'No posts from this user yet.' : 'No posts available.'}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
} 