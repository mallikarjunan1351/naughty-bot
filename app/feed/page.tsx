'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../lib/store/store';
import { fetchPosts } from '../../lib/store/slices/postsSlice';
import { fetchComments } from '../../lib/store/slices/commentsSlice';
import { fetchUsers } from '../../lib/store/slices/usersSlice';
import Navbar from '../../components/Navbar';
import UserSection from '../../components/UserSection';
import PostList from '../../components/PostList';
import { FullPageLoader, SkeletonLoader } from '../../components/ui/Loader';
import AnimatedBackground from '../../components/AnimatedBackground';

export default function FeedPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [theme, setTheme] = useState<'dark' | 'light'>('light');
  
  const { posts, status: postsStatus } = useSelector((state: RootState) => state.posts);
  const { comments, status: commentsStatus } = useSelector((state: RootState) => state.comments);
  const { users, status: usersStatus } = useSelector((state: RootState) => state.users);

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
    <div className="relative min-h-screen">
      {/* Animated background with reduced opacity */}
      <div className="fixed inset-0 z-0">
        <AnimatedBackground theme={theme} />
      </div>
      
      {/* Content with higher z-index */}
      <div className="relative z-10 min-h-screen">
        <Navbar />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <UserSection currentUser={session.user} users={users} />
            </div>
            
            <div className="lg:col-span-3">
              {isLoading ? (
                <div className="space-y-6">
                  <SkeletonLoader />
                </div>
              ) : (
                <PostList 
                  posts={posts} 
                  comments={comments} 
                  users={users} 
                  currentUserId={session.user.id}
                />
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 