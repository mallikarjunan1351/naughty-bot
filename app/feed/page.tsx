'use client';

import { useEffect } from 'react';
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

export default function FeedPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  
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

  if (status === 'loading') {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!session) {
    return null;
  }

  const isLoading = 
    postsStatus === 'loading' || 
    commentsStatus === 'loading' || 
    usersStatus === 'loading';

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <UserSection currentUser={session.user} users={users} />
          </div>
          
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <p className="text-lg">Loading posts...</p>
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
  );
} 