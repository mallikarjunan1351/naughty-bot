'use client';

import { Post } from '../lib/store/slices/postsSlice';
import { Comment } from '../lib/store/slices/commentsSlice';
import { User } from '../lib/store/slices/usersSlice';
import PostCard from './PostCard';

interface PostListProps {
  posts: Post[];
  comments: Comment[];
  users: User[];
  currentUserId: string;
}

export default function PostList({ posts, comments, users, currentUserId }: PostListProps) {
  // Sort posts by id in descending order (newest first)
  const sortedPosts = [...posts].sort((a, b) => b.id - a.id);

  return (
    <div className="space-y-6">
      {sortedPosts.map((post) => {
        const author = users.find(user => user.id === post.userId);
        const postComments = comments.filter(comment => comment.postId === post.id);
        
        return (
          <PostCard
            key={post.id}
            post={post}
            author={author}
            comments={postComments}
            currentUserId={currentUserId}
          />
        );
      })}
    </div>
  );
} 